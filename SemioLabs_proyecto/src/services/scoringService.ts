import type { ScoreBracket } from '../types/sindrogames';

const SCORE_BRACKETS: ScoreBracket[] = [
  { minSeconds: 0, maxSeconds: 5, points: 10 },
  { minSeconds: 5, maxSeconds: 10, points: 8 },
  { minSeconds: 10, maxSeconds: 15, points: 6 },
];

export const STREAK_BONUSES = [
  { streak: 3, points: 2 },
  { streak: 5, points: 5 },
];

export function getScoreRulesViewModel() {
  return [
    ...SCORE_BRACKETS.map((bucket) => ({
      label: `${bucket.minSeconds === 0 ? '<' : ''} ${bucket.maxSeconds} segundos`.trim(),
      value: `+${bucket.points} puntos`,
    })),
    { label: 'Incorrecta', value: '0 puntos' },
  ];
}

export function getStreakBonusesViewModel() {
  return STREAK_BONUSES.map((bonus) => ({
    label: `${bonus.streak} correctas seguidas`,
    value: `+${bonus.points} puntos extra`,
  }));
}

export function calculateAnswerPoints(seconds: number, isCorrect: boolean) {
  if (!isCorrect) {
    return 0;
  }

  const bucket = SCORE_BRACKETS.find((rule) => seconds >= rule.minSeconds && seconds < rule.maxSeconds);
  return bucket?.points ?? 0;
}

export function getStreakBonus(streak: number) {
  const bonus = STREAK_BONUSES.find((item) => item.streak === streak);
  return bonus?.points ?? 0;
}