import { useMemo, useState } from 'react';
import type { LocalProgress, MatchHistoryItem } from '../types/gameplay';

const STORAGE_KEY = 'semiolabs.local.progress';

const LEVELS = [
  { threshold: 0, name: 'Estudiante Novato' },
  { threshold: 200, name: 'Aprendiz Clínico' },
  { threshold: 450, name: 'Analista' },
  { threshold: 800, name: 'Investigador' },
  { threshold: 1200, name: 'Especialista' },
  { threshold: 1700, name: 'Experto en Psicopatología' },
];

function resolveLevel(xp: number) {
  let current = LEVELS[0].name;

  for (const level of LEVELS) {
    if (xp >= level.threshold) {
      current = level.name;
    }
  }

  return current;
}

function getInitialProgress(): LocalProgress {
  const empty: LocalProgress = {
    xp: 0,
    level: resolveLevel(0),
    totalMatches: 0,
    wins: 0,
    bestScore: 0,
    history: [],
  };

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return empty;
  }

  try {
    const parsed = JSON.parse(raw) as LocalProgress;
    return {
      ...empty,
      ...parsed,
      level: resolveLevel(parsed.xp ?? 0),
      history: Array.isArray(parsed.history) ? parsed.history : [],
    };
  } catch {
    return empty;
  }
}

function getXpGain(match: MatchHistoryItem) {
  let xp = 50;
  if (match.won) {
    xp += 200;
  }
  if (match.perfectStreak) {
    xp += 100;
  }
  return xp;
}

export function useLocalProgress() {
  const [progress, setProgress] = useState<LocalProgress>(() => getInitialProgress());

  const stats = useMemo(
    () => ({
      accuracyAverage:
        progress.history.length > 0
          ? Number((progress.history.reduce((acc, item) => acc + item.accuracy, 0) / progress.history.length).toFixed(1))
          : 0,
      recentMatches: progress.history.slice(0, 5),
    }),
    [progress],
  );

  const saveMatch = (item: MatchHistoryItem) => {
    setProgress((prev) => {
      const xp = prev.xp + getXpGain(item);
      const next: LocalProgress = {
        ...prev,
        xp,
        level: resolveLevel(xp),
        totalMatches: prev.totalMatches + 1,
        wins: prev.wins + (item.won ? 1 : 0),
        bestScore: Math.max(prev.bestScore, item.score),
        history: [item, ...prev.history].slice(0, 30),
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  return { progress, stats, saveMatch };
}
