import { ThemeProvider } from './providers';
import Timer, { TimerSequenceProvider, TimerControllerProvider } from './components/Timer';

import css from './App.module.scss';

import type { TimeSequence } from './components/Timer';

const data: TimeSequence[] = [
  { type: 'setup', duration: 1 },
  { type: 'round', round: 1, duration: 1 },
  { type: 'rest', round: 1, duration: 1 },
  { type: 'round', round: 2, duration: 1 },
  { type: 'rest', round: 2, duration: 1 },
  { type: 'round', round: 3, duration: 1 },
  { type: 'rest', round: 3, duration: 1 },
  { type: 'round', round: 4, duration: 1 },
  { type: 'rest', round: 4, duration: 1 },
  { type: 'round', round: 5, duration: 1 },
  { type: 'rest', round: 5, duration: 1 },
  { type: 'round', round: 6, duration: 1 },
];

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="seconds-out-theme">
      <main className={css.root}>
        <TimerSequenceProvider sequence={data}>
          <TimerControllerProvider>
            <Timer />
          </TimerControllerProvider>
        </TimerSequenceProvider>
      </main>
    </ThemeProvider>
  )
}

export default App
