import { useEffect, useRef } from 'react';

import Timer from './components/Timer';
import {
  ThemeProvider,
  TimerConfigsProvider,
  useTimerConfigs,
} from './providers';

import css from './App.module.scss';

function App() {
  const mainRef = useRef<HTMLElement>(null);
  const { configs, selectedIndex, setSelectedIndex } = useTimerConfigs();
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
  // 초기 스크롤 위치 설정
  useEffect(() => {
    const mainElement = mainRef.current;
    if (!mainElement) return;
    const width = mainElement.clientWidth;
    mainElement.scrollLeft = selectedIndex * width;
  }, [selectedIndex]);
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
  return (
    <main ref={mainRef} className={css.root}>
      {configs.map((config, index) => (
        <Timer key={index} config={config} active={selectedIndex === index} />
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
