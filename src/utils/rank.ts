export interface RankProgress {
  name: string;
  currentFloor: number;
  nextThreshold: number;
  progressPercent: number;
  xpRemaining: number;
}

const ranks = [
  { name: 'Bronze V', min: 0 },
  { name: 'Bronze IV', min: 100 },
  { name: 'Bronze I', min: 250 },
  { name: 'Silver V', min: 500 },
  { name: 'Silver I', min: 800 },
  { name: 'Gold V', min: 1200 },
  { name: 'Gold I', min: 1800 },
  { name: 'Platinum V', min: 2500 },
  { name: 'Platinum I', min: 3500 },
  { name: 'Diamond V', min: 4800 },
  { name: 'Diamond I', min: 6200 },
  { name: 'Crown', min: 7800 },
  { name: 'Ace', min: 9500 },
  { name: 'Conqueror', min: 12000 },
];

export function getRankProgress(xp: number): RankProgress {
  const safeXp = Math.max(0, xp || 0);
  let index = 0;

  for (let i = 0; i < ranks.length; i += 1) {
    if (safeXp >= ranks[i].min) index = i;
    else break;
  }

  const current = ranks[index];
  const next = ranks[index + 1];

  if (!next) {
    return {
      name: current.name,
      currentFloor: current.min,
      nextThreshold: current.min,
      progressPercent: 100,
      xpRemaining: 0,
    };
  }

  const span = next.min - current.min;
  const progress = span > 0 ? ((safeXp - current.min) / span) * 100 : 100;

  return {
    name: current.name,
    currentFloor: current.min,
    nextThreshold: next.min,
    progressPercent: Math.max(0, Math.min(100, Math.round(progress))),
    xpRemaining: Math.max(0, next.min - safeXp),
  };
}
