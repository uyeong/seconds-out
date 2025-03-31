import { createContext, useContext, useState, useEffect } from 'react';

import { useMounted } from '~/hooks';

import type { FC, PropsWithChildren } from 'react';
import type { TimerConfig } from '~/components/Timer';

// 로컬 스토리지 키
const TIMER_CONFIGS_KEY = 'seconds-out-timer-configs';

interface Context {
  configs: TimerConfig[];
  add: (config: TimerConfig) => void;
  update: (index: number, config: TimerConfig) => void;
  remove: (index: number) => void;
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
}

const defaultConfigs: TimerConfig[] = [
  {
    theme: 'base',
    bell: 'digital',
    volume: 0.5,
    durations: {
      setupSeconds: 10,
      restSeconds: 60,
      roundSeconds: 180,
    },
    rounds: {
      count: 3,
    },
  },
];

const TimerConfigsContext = createContext<Context | undefined>(undefined);
const TimerConfigsProvider: FC<PropsWithChildren> = ({ children }) => {
  const mounted = useMounted();
  const [configs, setConfigs] = useState<TimerConfig[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  // 초기 로드
  useEffect(() => {
    if (mounted) {
      const savedConfigs = getSavedConfigs();
      // 저장된 설정이 없으면 기본값 사용
      if (savedConfigs && savedConfigs.length > 0) {
        setConfigs(savedConfigs);
      } else {
        setConfigs(defaultConfigs);
      }
      const savedIndex = getSavedConfigIndex();
      if (savedIndex !== null && savedIndex < (savedConfigs?.length || 0)) {
        setSelectedIndex(savedIndex);
      }
    }
  }, [mounted]);
  // 값이 변경될 때마다 로컬 스토리지 업데이트
  useEffect(() => {
    if (mounted && configs.length > 0) {
      saveConfigs(configs);
    }
  }, [mounted, configs]);
  useEffect(() => {
    if (mounted && configs.length > 0) {
      saveConfigIndex(selectedIndex);
    }
  }, [mounted, selectedIndex, configs.length]);
  // 로컬 스토리지에서 타이머 설정 가져오기
  const getSavedConfigs = (): TimerConfig[] | null => {
    if (typeof window === 'undefined') return null;
    try {
      const saved = window.localStorage.getItem(TIMER_CONFIGS_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error('Error loading timer configs from localStorage:', error);
      return null;
    }
  };
  // 로컬 스토리지에 타이머 설정 저장하기
  const saveConfigs = (configs: TimerConfig[]): void => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(TIMER_CONFIGS_KEY, JSON.stringify(configs));
    } catch (error) {
      console.error('Error saving timer configs to localStorage:', error);
    }
  };
  // 선택된 설정 인덱스 가져오기
  const getSavedConfigIndex = (): number | null => {
    if (typeof window === 'undefined') return null;
    try {
      const saved = window.localStorage.getItem(
        `${TIMER_CONFIGS_KEY}-selected`,
      );
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error(
        'Error loading selected config index from localStorage:',
        error,
      );
      return null;
    }
  };
  // 선택된 설정 인덱스 저장하기
  const saveConfigIndex = (index: number): void => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(
        `${TIMER_CONFIGS_KEY}-selected`,
        JSON.stringify(index),
      );
    } catch (error) {
      console.error(
        'Error saving selected config index to localStorage:',
        error,
      );
    }
  };
  // 타이머 설정 추가
  const add = (config: TimerConfig): void => {
    setConfigs((prev) => [...prev, config]);
  };
  // 타이머 설정 업데이트
  const update = (index: number, config: TimerConfig): void => {
    setConfigs((prev) => {
      if (index < 0 || index >= prev.length) return prev;
      const updated = [...prev];
      updated[index] = config;
      return updated;
    });
  };
  // 타이머 설정 제거
  const remove = (index: number): void => {
    setConfigs((prev) => {
      if (index < 0 || index >= prev.length) return prev;
      const updated = [...prev];
      updated.splice(index, 1);
      // 선택된 인덱스 조정
      if (selectedIndex >= updated.length) {
        setSelectedIndex(Math.max(0, updated.length - 1));
      }
      return updated;
    });
  };
  return (
    <TimerConfigsContext.Provider
      value={{
        configs,
        add,
        update,
        remove,
        selectedIndex,
        setSelectedIndex,
      }}
    >
      {children}
    </TimerConfigsContext.Provider>
  );
};

const useTimerConfigs = () => {
  const context = useContext(TimerConfigsContext);
  if (!context) {
    throw new Error(
      'useTimerConfigs must be used within a TimerConfigsProvider',
    );
  }
  return context;
};

export default TimerConfigsProvider;
// eslint-disable-next-line react-refresh/only-export-components
export { TimerConfigsContext, useTimerConfigs };
