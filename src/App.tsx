import { ThemeProvider } from './providers';
import Timer, { TimerSequenceProvider, TimerControllerProvider } from './components/Timer';

import css from './App.module.scss';

import type { TimeSequence } from './components/Timer';

const data: TimeSequence[] = [
  { type: 'setup', duration: 10 },
  { type: 'round', round: 1, duration: 90 },
  { type: 'rest', round: 1, duration: 30 },
  { type: 'round', round: 2, duration: 90 },
  { type: 'rest', round: 2, duration: 30 },
  { type: 'round', round: 3, duration: 90 }
]

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="seconds-out-theme">
      <div className={css.app}>
        <TimerSequenceProvider sequence={data}>
          <TimerControllerProvider>
            <Timer />
          </TimerControllerProvider>
        </TimerSequenceProvider>
      </div>
    </ThemeProvider>
  )
}

export default App
