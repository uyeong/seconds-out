import { createContext, useContext, useState } from 'react';
import { useEventCallback } from '~/utils';

import type { FC, PropsWithChildren } from 'react';

interface Context {
  playing: boolean;
  paused: boolean;
  stopped: boolean;
  play: () => void;
  pause: () => void;
  stop: () => void;
}

const TimerControllerContext = createContext<Context | undefined>(undefined);
const TimerControllerProvider: FC<PropsWithChildren> = ({ children }) => {
  const [state, setState] = useState({ stopped: true, paused: false });
  const play = useEventCallback(() => setState({ stopped: false, paused: false }));
  const pause = useEventCallback(() => setState(prev => ({ ...prev, paused: true })));
  const stop = useEventCallback(() => setState({ stopped: true, paused: false }));
  return (
    <TimerControllerContext.Provider value={{
      ...state,
      playing: !state.stopped && !state.paused,
      play,
      pause,
      stop,
    }}>
      {children}
    </TimerControllerContext.Provider>
  );
};

const useTimerController = () => {
  const context = useContext(TimerControllerContext);
  if (!context) {
    throw new Error('useTimerController must be used within a TimerControllerProvider');
  }
  return context;
};

export default TimerControllerProvider;
export { TimerControllerContext, useTimerController };
export type { Context };
