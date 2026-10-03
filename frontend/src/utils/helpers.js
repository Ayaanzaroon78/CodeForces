export function formatNumber(num) {
  if (!num) return '0';
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
  return num.toString();
}

export function getDifficultyColor(difficulty) {
  switch (difficulty?.toLowerCase()) {
    case 'beginner':
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    case 'intermediate':
      return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    case 'advanced':
      return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
    default:
      return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
  }
}

export function getMatchScoreColor(score) {
  if (score >= 85) return 'text-emerald-400 stroke-emerald-500';
  if (score >= 70) return 'text-indigo-400 stroke-indigo-500';
  return 'text-amber-400 stroke-amber-500';
}
