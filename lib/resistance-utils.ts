// Helper utilities for resistance tracking

export type ResistanceType = 'perfectionism' | 'self-doubt' | 'procrastination' | 'fatigue' | 'fear' | 'distraction';

export const RESISTANCE_TYPES: { value: ResistanceType; label: string; emoji: string }[] = [
  { value: 'perfectionism', label: 'Perfectionism', emoji: '🎯' },
  { value: 'self-doubt', label: 'Self-doubt', emoji: '💭' },
  { value: 'procrastination', label: 'Procrastination', emoji: '⏰' },
  { value: 'fatigue', label: 'Fatigue', emoji: '😴' },
  { value: 'fear', label: 'Fear', emoji: '😨' },
  { value: 'distraction', label: 'Distraction', emoji: '📱' },
];

export function getResistanceLabel(type?: ResistanceType): string {
  const found = RESISTANCE_TYPES.find((r) => r.value === type);
  return found ? `${found.emoji} ${found.label}` : 'Unspecified';
}

export function getResistanceEmoji(type?: ResistanceType): string {
  const found = RESISTANCE_TYPES.find((r) => r.value === type);
  return found ? found.emoji : '💪';
}
