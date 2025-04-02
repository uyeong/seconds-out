import { ThemeProvider } from './providers';
import Header from './components/Header';
import Timer, { TimerSequenceProvider, TimerControllerProvider } from './components/Timer';

import css from './App.module.scss';

import type { TimeSequence } from './components/Timer';

const data: TimeSequence[] = [
  { type: 'setup', duration: 3 },
  { type: 'round', round: 1, duration: 10 },
  { type: 'rest', round: 1, duration: 3 },
  { type: 'round', round: 2, duration: 10 },
]

function App() {
  return (
    <ThemeProvider storageKey="seconds-out-theme">
      <main className={css.root}>
        <Header />
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
