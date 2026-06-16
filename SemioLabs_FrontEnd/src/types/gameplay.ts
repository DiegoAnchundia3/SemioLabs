export interface StudySyndrome {
  id: string;
  name: string;
  definition: string;
  traits: string[];
  symptoms: string[];
  differences: string[];
}

export interface QuizQuestion {
  id: string;
  syndromeId: string;
  prompt: string;
  options: string[];
  answerIndex: number;
}

export interface CrosswordClue {
  id: string;
  number: number;
  direction: 'across' | 'down';
  row: number;
  col: number;
  length: number;
  clue: string;
  answer: string;
}

export interface CrosswordPuzzle {
  id: string;
  rows: number;
  cols: number;
  cells: Array<Array<{ blocked: boolean; solution?: string; number?: number }>>;
  clues: CrosswordClue[];
}

export interface HangmanQuestion {
  id: string;
  syndromeId: string;
  answer: string;
  hint: string;
  detail: string;
}

export interface MatchPlayer {
  id: string;
  name: string;
  score: number;
  streak: number;
  correct: number;
  incorrect: number;
  isBot: boolean;
}

export interface MatchHistoryItem {
  id: string;
  mode: 'individual' | 'diagnostico-express' | 'verdadero-falso' | 'asocia-sintomas' | 'crucigrama' | 'ahorcado' | 'carrusel';
  date: string;
  score: number;
  correct: number;
  incorrect: number;
  averageTime: number;
  accuracy: number;
  won: boolean;
  perfectStreak: boolean;
}

export interface LocalProgress {
  xp: number;
  level: string;
  totalMatches: number;
  wins: number;
  bestScore: number;
  history: MatchHistoryItem[];
}
