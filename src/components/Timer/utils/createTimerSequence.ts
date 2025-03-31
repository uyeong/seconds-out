import type { TimerConfig, TimerSequence } from '../types';

function createTimerSequence({
  durations,
  rounds,
}: TimerConfig): TimerSequence[] {
  const sequence: TimerSequence[] = [];
  if (durations.setupSeconds > 0) {
    sequence.push({
      type: 'setup',
      name: 'SETUP',
      duration: durations.setupSeconds,
    });
  }
  for (let i = 1; i <= rounds.count; i = i + 1) {
    if (i < rounds.count) {
      sequence.push({
        type: 'round',
        name: `ROUND ${i}`,
        round: i,
        duration: durations.roundSeconds,
      });
      sequence.push({
        type: 'rest',
        name: 'REST',
        duration: durations.restSeconds,
      });
    } else {
      sequence.push({
        type: 'round',
        name: 'FINAL ROUND',
        round: i,
        duration: durations.roundSeconds,
      });
    }
  }
  return sequence;
}

export default createTimerSequence;
