import { createContext, useContext, useState } from 'react';

import { useEventCallback } from '~/utils';

import type { FC, PropsWithChildren } from 'react';

interface TimeSequence {
  type: 'setup' | 'round' | 'rest';
  round?: number;
  duration: number;
}

interface Context {
  sequence: TimeSequence[];
  current: TimeSequence;
  next: () => void;
  reset: () => void;
}

interface Props extends PropsWithChildren {
  sequence: TimeSequence[];
}

const TimerSequenceContext = createContext<Context | undefined>(undefined);
const TimerSequenceProvider: FC<Props> = ({ sequence, children }) => {
  const [currentSeqIndex, setCurrentSeqIndex] = useState(0);
  const next = useEventCallback(() => {
    setCurrentSeqIndex(prev => Math.min(prev + 1, sequence.length));
  });
  const reset = useEventCallback(() => {
    setCurrentSeqIndex(0);
  });
  return (
    <TimerSequenceContext.Provider value={{
      sequence,
      current: sequence[currentSeqIndex],
      next,
      reset,
    }}>
      {children}
    </TimerSequenceContext.Provider>
  );
};

const useTimerSequence = () => {
  const context = useContext(TimerSequenceContext);
  if (!context) {
    throw new Error('useTimerSequence must be used within a TimerSequenceContext');
  }
  return context;
};

export default TimerSequenceProvider;
export { TimerSequenceContext, useTimerSequence };
export type { Context, TimeSequence };
