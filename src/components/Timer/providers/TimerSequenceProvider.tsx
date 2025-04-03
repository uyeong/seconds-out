import { createContext, useContext, useState } from 'react';

import { useEventCallback } from '~/hooks';
import { TimerSequence } from '../types';

import type { FC, PropsWithChildren } from 'react';
import { useTimerConfig } from './TimerConfigProvider';

interface Context {
  sequence: TimerSequence[];
  current: TimerSequence;
  next: () => void;
  reset: () => void;
  hasNext: () => boolean;
}

const TimerSequenceContext = createContext<Context | undefined>(undefined);
const TimerSequenceProvider: FC<PropsWithChildren> = ({ children }) => {
  const { sequence } = useTimerConfig();
  const [currentSeqIndex, setCurrentSeqIndex] = useState(0);
  const next = useEventCallback(() => {
    setCurrentSeqIndex(prev => Math.min(prev + 1, sequence.length));
  });
  const reset = useEventCallback(() => {
    setCurrentSeqIndex(0);
  });
  const hasNext = useEventCallback(() => {
    return currentSeqIndex < sequence.length - 1;
  });
  return (
    <TimerSequenceContext.Provider value={{
      sequence,
      current: sequence[currentSeqIndex],
      next,
      reset,
      hasNext,
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
export type { Context };
