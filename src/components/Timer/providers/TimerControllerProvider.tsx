import { createContext, useContext, useState, useCallback } from 'react';
import { useEventCallback } from '~/utils';

import type { FC, PropsWithChildren } from 'react';

interface Context {
  play: () => void;
  pause: () => void;
  stop: () => void;
  isPlaying: () => boolean;
  isPaused: () => boolean;
  isStopped: () => boolean;
}

const TimerControllerContext = createContext<Context | undefined>(undefined);
const TimerControllerProvider: FC<PropsWithChildren> = ({ children }) => {
  const [state, setState] = useState({ stopped: true, paused: false });
  const play = useEventCallback(() => setState({ stopped: false, paused: false }));
  const pause = useEventCallback(() => setState(prev => ({ ...prev, paused: true })));
  const stop = useEventCallback(() => setState({ stopped: true, paused: false }));
  const isPlaying = useCallback(() => !state.stopped && !state.paused, [ state ]);
  const isPaused = useCallback(() => state.paused, [ state ]);
  const isStopped = useCallback(() => state.stopped, [ state ]);
  return (
    <TimerControllerContext.Provider value={{
      play,
      pause,
      stop,
      isPlaying,
      isPaused, 
      isStopped,
    }}>
      {children}
    </TimerControllerContext.Provider>
  );
};

const useTimerController = () => {
  const context = useContext(TimerControllerContext);
  if (!context) {
    throw new Error('useTimerState must be used within a TimerStateProvider');
  }
  return context;
};

export default TimerControllerProvider;
export { useTimerController };
export type { Context };
