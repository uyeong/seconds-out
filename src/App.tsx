import { ThemeProvider } from './providers';
import Header from './components/Header';
import Timer, { TimerConfigProvider } from './components/Timer';

import type { TimerConfig } from './components/Timer/types';

import css from './App.module.scss';

const defaultTimerConfig: TimerConfig = {
  id: 0,
  // theme: { // 편안한
  //   bgColor: '#F1F8E9',
  //   textColor: '#2E3B2C' ,
  //   chart: {
  //     setup: '#00C853',
  //     rest: '#2979FF',
  //     round: '#D50000',
  //   }
  // },
  // theme: { // 어두운
  //   bgColor: '#1C1C1E',        // 진한 차콜 블랙 (딥 네이비 느낌)
  //   textColor: '#F1F8E9',      // 기존 밝은 배경 색을 역으로 텍스트에 사용 (은은한 라이트 라임)
  //   chart: {
  //     setup: '#00C853',        // 네온 그린 (빛나는 느낌)
  //     rest: '#2979FF',         // 시원한 블루
  //     round: '#D50000',        // 강렬한 레드
  //   }
  // },
  // theme: { // 시원한
  //   bgColor: '#E0F7FA',         // 밝고 맑은 시안 (하늘색 + 민트 느낌)
  //   textColor: '#004D40',       // 깊이감 있는 청록, 시원한 톤 유지하면서 또렷함
  //   chart: {
  //     setup: '#00BFA5',         // 청록 + 네온 그린 느낌 (깔끔하게 튐)
  //     round: '#0288D1',         // 선명한 블루 (긴장감 있는 시원함)
  //     rest:  '#4DD0E1',         // 밝고 부드러운 시안 (완전 chill한 느낌)
  //   },
  // },
  theme: { // 열정적인
    bgColor: '#FFF3E0',         // 따뜻하고 부드러운 오렌지 크림 (열정의 부드러운 베이스)
    textColor: '#BF360C',       // 딥 브릭 레드 (진중하면서도 강한 인상)
    chart: {
      setup: '#F57C00',         // 불타는 오렌지 (활기찬 시작)
      round: '#D32F2F',         // 강렬한 레드 (전투, 클라이맥스 느낌)
      rest:  '#FF8A65',         // 살짝 진정된 코랄 톤 (따뜻한 휴식)
    },
  },
  durations: {
    setup: 1,
    rest: 2,
    round: 3,
    count: 3
  }
};

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="seconds-out-theme">
      <main className={css.root}>
        <Header />
        <TimerConfigProvider defaultConfig={defaultTimerConfig}>
          <Timer />
        </TimerConfigProvider>
      </main>
    </ThemeProvider>
  )
}

export default App
