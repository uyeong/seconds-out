interface TimerConfig {
  id: number;
  theme: {
    bgColor: string;
    textColor: string;
    chart: {
      setup: string;
      rest: string;
      round: string;
    }
  };
  durations: {
    setup: number;
    rest: number;
    round: number;
    count: number;
  };
}

export default TimerConfig;