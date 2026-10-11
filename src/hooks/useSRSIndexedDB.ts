import { useState, useEffect, useCallback, useRef } from 'react';
import { SRSCard, JLPTLevel, UserStats } from '../types';
import { dbInstance } from '../db/indexdb';

export type ReviewGrade = 1 | 2 | 3 | 4; // 1: Again (Quên), 2: Hard (Khó), 3: Good (Nhớ tạm), 4: Easy (Dễ)

interface ReviewHistorySnapshot {
  cardBefore: SRSCard;
  cardAfter: SRSCard;
  statsBefore: UserStats | null;
}

export const useSRSIndexedDB = () => {
  const [cards, setCards] = useState<SRSCard[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [canUndo, setCanUndo] = useState(false);
  const lastSnapshotRef = useRef<ReviewHistorySnapshot | null>(null);

  // Load cards and stats
  const reloadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const allCards = await dbInstance.getAllCards();
      const userStats = await dbInstance.getStats();
      setCards(allCards);
      setStats(userStats);
    } catch (err) {
      console.error('Failed to load SRS data', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    reloadData();
  }, [reloadData]);

  // SM-2 Enhanced / FSRS-inspired Review Processing
  const reviewCard = useCallback(async (cardId: string, grade: ReviewGrade): Promise<SRSCard | null> => {
    const card = cards.find((c) => c.id === cardId);
    if (!card) return null;

    // Snapshot before modifying for 1-click Undo
    const snapshot: ReviewHistorySnapshot = {
      cardBefore: { ...card },
      cardAfter: { ...card },
      statsBefore: stats ? { ...stats } : null,
    };

    let { repetition, interval, easeFactor, lapses = 0 } = card;

    let newRepetition = repetition;
    let newInterval = interval;
    let newEF = easeFactor;
    let newLapses = lapses;

    // Calculate progression according to 4-grade SM-2 Plus algorithm
    switch (grade) {
      case 1: // Again / Quên
        newLapses += 1;
        newRepetition = 0;
        newInterval = 1; // Repeat tomorrow
        newEF = Math.max(1.3, easeFactor - 0.2);
        break;

      case 2: // Hard / Khó
        newRepetition = Math.max(1, repetition);
        newInterval = Math.max(1, Math.round(interval * 1.2));
        newEF = Math.max(1.3, easeFactor - 0.15);
        break;

      case 3: // Good / Nhớ tạm
        if (repetition === 0) {
          newInterval = 1;
        } else if (repetition === 1) {
          newInterval = 6;
        } else {
          newInterval = Math.round(interval * easeFactor);
        }
        newRepetition += 1;
        break;

      case 4: // Easy / Dễ & Thuần thục
        if (repetition === 0) {
          newInterval = 4;
        } else if (repetition === 1) {
          newInterval = 10;
        } else {
          newInterval = Math.round(interval * easeFactor * 1.35 + 2);
        }
        newRepetition += 1;
        newEF = Math.min(3.0, easeFactor + 0.15);
        break;
    }

    const now = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;
    const dueDate = now + newInterval * oneDayMs;
    const isMastered = newInterval >= 21;
    const isLeech = newLapses >= 4; // Thẻ khó cần lưu ý đặc biệt

    const updatedCard: SRSCard = {
      ...card,
      repetition: newRepetition,
      interval: newInterval,
      easeFactor: Number(newEF.toFixed(2)),
      dueDate,
      lastReview: now,
      lapses: newLapses,
      isLeech,
      status: isMastered ? 'mastered' : 'learning',
    };

    snapshot.cardAfter = updatedCard;
    lastSnapshotRef.current = snapshot;
    setCanUndo(true);

    // Persist to IndexedDB
    await dbInstance.saveCard(updatedCard);

    // Record Daily Activity in study streaks store
    await dbInstance.recordDailyActivity(1, 0);

    // Update in-memory cards
    setCards((prev) => prev.map((c) => (c.id === cardId ? updatedCard : c)));

    // Update User Stats
    if (stats) {
      const todayStr = new Date().toISOString().slice(0, 10);
      const isNewDay = stats.lastActiveDate !== todayStr;
      const updatedStreak = isNewDay ? stats.streak + 1 : stats.streak;

      // Recalculate mastered counts
      const updatedCards = cards.map((c) => (c.id === cardId ? updatedCard : c));
      const masteredN5 = updatedCards.filter((c) => c.level === 'N5' && c.status === 'mastered').length;
      const masteredN4 = updatedCards.filter((c) => c.level === 'N4' && c.status === 'mastered').length;
      const masteredN3 = updatedCards.filter((c) => c.level === 'N3' && c.status === 'mastered').length;

      const newStats: UserStats = {
        ...stats,
        streak: updatedStreak,
        lastActiveDate: todayStr,
        cardsMasteredN5: masteredN5,
        cardsMasteredN4: masteredN4,
        cardsMasteredN3: masteredN3,
        totalReviewsCompleted: stats.totalReviewsCompleted + 1,
      };

      await dbInstance.saveStats(newStats);
      setStats(newStats);
    }

    return updatedCard;
  }, [cards, stats]);

  // Undo last review operation
  const undoLastReview = useCallback(async (): Promise<boolean> => {
    const snapshot = lastSnapshotRef.current;
    if (!snapshot) return false;

    const { cardBefore, statsBefore } = snapshot;

    // Rollback card in IndexedDB
    await dbInstance.saveCard(cardBefore);

    // Rollback stats
    if (statsBefore) {
      await dbInstance.saveStats(statsBefore);
      setStats(statsBefore);
    }

    // Rollback in memory
    setCards((prev) => prev.map((c) => (c.id === cardBefore.id ? cardBefore : c)));

    lastSnapshotRef.current = null;
    setCanUndo(false);
    return true;
  }, []);

  // Filter due cards for review session
  const getDueCards = useCallback((levelFilter?: JLPTLevel): SRSCard[] => {
    const now = Date.now();
    return cards.filter((card) => {
      const matchesLevel = !levelFilter || levelFilter === 'Zero' || card.level === levelFilter;
      const isDue = !card.dueDate || card.dueDate <= now;
      return matchesLevel && isDue;
    });
  }, [cards]);

  // Filter leech cards (difficult cards that lapsed 4+ times)
  const getLeechCards = useCallback((): SRSCard[] => {
    return cards.filter((c) => c.isLeech || (c.lapses && c.lapses >= 4));
  }, [cards]);

  // Initialize seed cards if DB is empty
  const seedDefaultCards = useCallback(async (seedData: SRSCard[]) => {
    const existing = await dbInstance.getAllCards();
    if (existing.length === 0) {
      await dbInstance.bulkSaveCards(seedData);
      setCards(seedData);
    }
  }, []);

  return {
    cards,
    stats,
    isLoading,
    canUndo,
    reloadData,
    reviewCard,
    undoLastReview,
    getDueCards,
    getLeechCards,
    seedDefaultCards,
  };
};
