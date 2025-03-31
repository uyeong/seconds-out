interface TimerSequence {
  type: 'setup' | 'round' | 'rest';
  name: string;
  round?: number;
  duration: number;
}

export default TimerSequence;
