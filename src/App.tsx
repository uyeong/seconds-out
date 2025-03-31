import { Timer, TimerSequenceProvider, TimerControllerProvider } from './components';

import css from './App.module.scss';

import type { TimeSequence } from './components';

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
    <TimerSequenceProvider sequence={data}>
      <TimerControllerProvider>
        <div className={css.app}>
          <Timer />
        </div>
      </TimerControllerProvider>
    </TimerSequenceProvider>
  )
}

export default App
