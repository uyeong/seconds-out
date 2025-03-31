import { useMemo, useState } from 'react';

import { useEventCallback } from '~/hooks';

import { createTimerSequence } from '../utils';

import type { TimerConfig } from '../types';

function useTimerSequence(config: TimerConfig) {
  const sequence = useMemo(() => createTimerSequence(config), [config]);
  const [currentSeqIndex, setCurrentSeqIndex] = useState(0);
  const next = useEventCallback(() => {
    setCurrentSeqIndex((prev) => Math.min(prev + 1, sequence.length));
  });
  const reset = useEventCallback(() => {
    setCurrentSeqIndex(0);
  });
  const hasNext = useEventCallback(() => {
    return currentSeqIndex < sequence.length - 1;
  });
  return {
    sequence,
    currentSeqIndex,
    next,
    reset,
    hasNext,
  };
}

export default useTimerSequence;
