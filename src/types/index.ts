export type JLPTLevel = 'Zero' | 'N5' | 'N4' | 'N3';

export type MainTab = 'kana' | 'kanji' | 'grammar' | 'dokkai' | 'srs' | 'dashboard';

export interface KanaItem {
  id: string;
  char: string;
  romaji: string;
  type: 'hiragana' | 'katakana';
  category: 'gojuon' | 'dakuon' | 'handakuon' | 'yoon';
  mnemonicVi: string;
  mnemonicEn?: string;
  exampleWord: string;
  exampleReading: string;
  exampleMeaning: string;
  strokes: number;
  strokeSvgPath?: string;
}

export interface JukugoWord {
  kanji: string;
  hiragana: string;
  romaji: string;
  hanViet: string;
  meaningVi: string;
}

export interface KanjiItem {
  id: string;
  kanji: string;
  hanViet: string;
  level: 'N5' | 'N4' | 'N3';
  strokes: number;
  radicals: string[]; // e.g. ["氵(Thủy)", "木(Mộc)"]
  onyomi: string[];
  kunyomi: string[];
  meaningVi: string;
  phoneticRule?: string; // Quy tắc chuyển âm Hán Việt sang On
  jukugo: JukugoWord[];
  strokePaths?: string[]; // relative svg stroke lines for tracing
}

export interface SentencePart {
  text: string;
  furigana?: string;
  role: 'subject' | 'object' | 'verb' | 'particle' | 'time' | 'location' | 'adverb';
  explanation?: string;
}

export interface GrammarItem {
  id: string;
  title: string;
  level: 'N5' | 'N4' | 'N3';
  category: string;
  formation: string; // Cấu trúc ngữ pháp
  meaningVi: string;
  explanationVi: string;
  sentenceBreakdown?: SentencePart[];
  examples: {
    jp: string;
    furigana: string;
    vi: string;
    note?: string;
  }[];
  nuanceVs?: {
    rivalTitle: string;
    difference: string;
    whenToUseA: string;
    whenToUseB: string;
    trick: string;
  };
}

export interface WordLookup {
  word: string;
  furigana: string;
  hanViet: string;
  meaning: string;
  type: string;
}

export interface ReadingItem {
  id: string;
  level: 'N4' | 'N3';
  title: string;
  topic: string;
  content: string; // Annotated with ruby or word tokens
  furiganaMap: { [word: string]: string };
  glossary: WordLookup[];
  questions: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
}

export interface SRSCard {
  id: string;
  front: string;
  back: string;
  furigana?: string;
  hanViet?: string;
  level: 'N5' | 'N4' | 'N3';
  type: 'vocab' | 'kanji' | 'grammar';
  repetition: number;
  interval: number; // in days
  easeFactor: number; // SM-2 EF, starts at 2.5
  dueDate: number; // timestamp in ms
  lastReview?: number;
  status: 'new' | 'learning' | 'mastered';
}

export interface UserStats {
  streak: number;
  lastActiveDate: string;
  cardsMasteredN5: number;
  cardsMasteredN4: number;
  cardsMasteredN3: number;
  totalReviewsCompleted: number;
  kanaSpeedBest: number;
}
