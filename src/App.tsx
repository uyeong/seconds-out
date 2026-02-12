import { useEffect, useRef, useState } from 'react';

import { useEventCallback } from '~/hooks';
import { cn } from '~/lib/utils';

import Timer from './components/Timer';
import {
  ThemeProvider,
  TimerConfigsProvider,
  useTimerConfigs,
} from './providers';

import css from './App.module.scss';

import type { AnimationEvent } from 'react';

function App() {
  const mainRef = useRef<HTMLElement>(null);
  const { configs, selectedIndex, setSelectedIndex, remove } =
    useTimerConfigs();
  const [removingIndex, setRemovingIndex] = useState<number | null>(null);
  // iOS 핀치 줌 방지
  useEffect(() => {
    const preventZoom = (event: TouchEvent) => {
      if (event.touches.length > 1) {
        event.preventDefault();
      }
    };
    document.addEventListener('touchstart', preventZoom, { passive: false });
    return () => {
      document.removeEventListener('touchstart', preventZoom);
    };
  }, []);
  // 타이머 추가/삭제 감지용
  const prevConfigsLength = useRef<number | null>(null);
  // 스크롤 위치 설정 (추가/삭제 시 smooth 애니메이션)
  useEffect(() => {
    const mainElement = mainRef.current;
    if (!mainElement) return;
    const width = mainElement.clientWidth;
    const shouldAnimate =
      prevConfigsLength.current !== null &&
      prevConfigsLength.current > 0 &&
      prevConfigsLength.current !== configs.length;
    prevConfigsLength.current = configs.length;
    if (shouldAnimate) {
      mainElement.scrollTo({ left: selectedIndex * width, behavior: 'smooth' });
    } else {
      mainElement.scrollLeft = selectedIndex * width;
    }
  }, [selectedIndex, configs.length]);
  // 스크롤 이벤트 리스너 설정
  useEffect(() => {
    const mainElement = mainRef.current;
    if (!mainElement) return;
    const handleScrollEnd = () => {
      if (!mainElement) return;
      const scrollLeft = mainElement.scrollLeft;
      const width = mainElement.clientWidth;
      const newActiveIndex = Math.round(scrollLeft / width);
      setSelectedIndex(newActiveIndex);
    };
    if ('onscrollend' in window) {
      mainElement.addEventListener('scrollend', handleScrollEnd, {
        passive: true,
      });
    } else {
      let scrollTimeout: ReturnType<typeof setTimeout>;
      const handleScroll = () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(handleScrollEnd, 150);
      };
      mainElement.addEventListener('scroll', handleScroll, { passive: true });
      return () => {
        mainElement.removeEventListener('scroll', handleScroll);
        clearTimeout(scrollTimeout);
      };
    }
    return () => {
      if ('onscrollend' in window) {
        mainElement.removeEventListener('scrollend', handleScrollEnd);
      }
    };
  }, [setSelectedIndex]);
  // 디바이스 회전 시 스크롤 위치 재조정
  useEffect(() => {
    const handleOrientationChange = () => {
      setTimeout(() => {
        const mainElement = mainRef.current;
        if (!mainElement) return;
        mainElement.scrollLeft = selectedIndex * mainElement.clientWidth;
      }, 10);
    };
    window.addEventListener('orientationchange', handleOrientationChange);
    return () =>
      window.removeEventListener('orientationchange', handleOrientationChange);
  }, [selectedIndex]);
  const handleRemove = useEventCallback((index: number) => {
    setRemovingIndex(index);
  });
  const handleAnimationEnd = useEventCallback((e: AnimationEvent) => {
    if (e.target !== e.currentTarget || removingIndex === null) return;
    remove(removingIndex);
    setRemovingIndex(null);
  });
  return (
    <main ref={mainRef} className={css.root}>
      {configs.map((config, index) => (
        <div
          key={index}
          className={cn(css.timerWrapper, {
            [css.removing]: removingIndex === index,
          })}
          onAnimationEnd={handleAnimationEnd}
        >
          <Timer
            config={config}
            active={selectedIndex === index}
            onRemove={() => handleRemove(index)}
          />
        </div>
      ))}
    </main>
  );
}

const LaunchApp = () => (
  <ThemeProvider defaultTheme="system" storageKey="seconds-out-theme">
    <TimerConfigsProvider>
      <App />
    </TimerConfigsProvider>
  </ThemeProvider>
);

export default LaunchApp;
