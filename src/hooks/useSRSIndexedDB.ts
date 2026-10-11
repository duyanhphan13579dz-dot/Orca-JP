import { useState, useEffect, useCallback } from 'react';
import { SRSCard, JLPTLevel, UserStats } from '../types';
import { dbInstance } from '../db/indexdb';

export type ReviewGrade = 1 | 2 | 3; // 1: Quên (0/1), 2: Nhớ tạm (3), 3: Thuần thục (5)

export const useSRSIndexedDB = () => {
  const [cards, setCards] = useState<SRSCard[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  // SM-2 Review processing
  const reviewCard = useCallback(async (cardId: string, grade: ReviewGrade): Promise<SRSCard | null> => {
    const card = cards.find(c => c.id === cardId);
    if (!card) return null;

    let { repetition, interval, easeFactor } = card;

    // Convert grade 1, 2, 3 to SM-2 scale (1 -> 1, 2 -> 3, 3 -> 5)
    const sm2Grade = grade === 1 ? 1 : grade === 2 ? 3 : 5;

    // Calculate new Ease Factor (EF)
    // EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
    const diff = 5 - sm2Grade;
    const newEF = Math.max(1.3, easeFactor + (0.1 - diff * (0.08 + diff * 0.02)));

    let newRepetition = repetition;
    let newInterval = interval;

    if (sm2Grade < 3) {
      // Failed card
      newRepetition = 0;
      newInterval = 1; // repeat tomorrow
    } else {
      // Successful recall
      if (repetition === 0) {
        newInterval = 1;
      } else if (repetition === 1) {
        newInterval = 6;
      } else {
        newInterval = Math.round(interval * newEF);
      }
      newRepetition += 1;
    }

    const now = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;
    const dueDate = now + newInterval * oneDayMs;
    const isMastered = newInterval >= 21;

    const updatedCard: SRSCard = {
      ...card,
      repetition: newRepetition,
      interval: newInterval,
      easeFactor: Number(newEF.toFixed(2)),
      dueDate,
      lastReview: now,
      status: isMastered ? 'mastered' : 'learning',
    };

    // Save to IndexedDB
    await dbInstance.saveCard(updatedCard);

    // Update in-memory cards
    setCards(prev => prev.map(c => c.id === cardId ? updatedCard : c));

    // Update Stats
    if (stats) {
      const todayStr = new Date().toISOString().slice(0, 10);
      const isNewDay = stats.lastActiveDate !== todayStr;
      const updatedStreak = isNewDay ? stats.streak + 1 : stats.streak;

      // Recalculate mastered counts
      const updatedCards = cards.map(c => c.id === cardId ? updatedCard : c);
      const masteredN5 = updatedCards.filter(c => c.level === 'N5' && c.status === 'mastered').length;
      const masteredN4 = updatedCards.filter(c => c.level === 'N4' && c.status === 'mastered').length;
      const masteredN3 = updatedCards.filter(c => c.level === 'N3' && c.status === 'mastered').length;

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

  // Filter due cards for review session
  const getDueCards = useCallback((levelFilter?: JLPTLevel): SRSCard[] => {
    const now = Date.now();
    return cards.filter(card => {
      const matchesLevel = !levelFilter || levelFilter === 'Zero' || card.level === levelFilter;
      // Due if never reviewed or dueDate is reached
      const isDue = !card.dueDate || card.dueDate <= now;
      return matchesLevel && isDue;
    });
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
    reloadData,
    reviewCard,
    getDueCards,
    seedDefaultCards,
  };
};
