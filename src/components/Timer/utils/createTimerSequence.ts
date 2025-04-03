import type { TimerConfig, TimerSequence } from '../types';

function createTimerSequence({ durations }: TimerConfig): TimerSequence[] {
  const sequence: TimerSequence[] = [];
  if (durations.setup > 0) {
    sequence.push({
      type: 'setup',
      name: 'SETUP',
      duration: durations.setup
    });
  }
  for (let i = 1; i <= durations.count; i = i + 1) {
    if (i < durations.count) {
      sequence.push({
        type: 'round', 
        name: `ROUND ${i}`,
        round: i,
        duration: durations.round
      });
      sequence.push({
        type: 'rest',
        name: 'REST',
        duration: durations.rest
      });
    } else {
      sequence.push({
        type: 'round',
        name: 'FINAL ROUND',
        round: i,
        duration: durations.round
      });
    }
  }
  return sequence;
} 

export default createTimerSequence;