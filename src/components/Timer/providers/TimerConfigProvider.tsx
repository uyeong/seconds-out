import { createContext, useContext, useState, useMemo } from 'react';

import { TimerConfig, TimerSequence } from '../types';
import { createTimerSequence } from '../utils';

import TimerSequenceProvider from './TimerSequenceProvider';
import TimerControllerProvider from './TimerControllerProvider';

import type { FC, PropsWithChildren } from 'react';

interface Context {
  config: TimerConfig;
  sequence: TimerSequence[];
  setConfig: (config: TimerConfig) => void;
}

interface Props extends PropsWithChildren {
  defaultConfig: TimerConfig;
}

const TimerConfigContext = createContext<Context | undefined>(undefined);
const TimerConfigProvider: FC<Props> = ({ defaultConfig, children }) => {
  const [config, setConfig] = useState<TimerConfig>(defaultConfig);
  const sequence = useMemo(() => createTimerSequence(config), [config]);
  return (
    <TimerConfigContext.Provider value={{
      config,
      sequence, 
      setConfig,
    }}>
      <TimerSequenceProvider>
        <TimerControllerProvider>
          {children}
        </TimerControllerProvider>
      </TimerSequenceProvider>
    </TimerConfigContext.Provider>
  );
};

const useTimerConfig = () => {
  const context = useContext(TimerConfigContext);
  if (!context) {
    throw new Error('useTimerConfig must be used within a TimerConfigProvider');
  }
  return context;
};

export default TimerConfigProvider;
export { TimerConfigContext, useTimerConfig };
export type { Context };
