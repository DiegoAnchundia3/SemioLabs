export interface StudyPoint {
  label: string;
}

export interface HeroStat {
  label: string;
  value: string;
}

export interface LeaderboardPlayer {
  name: string;
  score: number;
  streak: number;
}

export interface ScoreRule {
  label: string;
  value: string;
}

export interface RankingItem {
  label: string;
  description: string;
}

export interface AppConfig {
  appName: string;
  heroTitle: string;
  heroDescription: string;
  anonymousUserBadge: string;
}

export interface ScoreBracket {
  minSeconds: number;
  maxSeconds: number;
  points: number;
}
