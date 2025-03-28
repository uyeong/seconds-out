import { Timer, TimerControllerProvider } from './components';

import css from './App.module.scss';

function App() {
  return (
    <TimerControllerProvider>
      <div className={css.app}>
        <Timer seconds={30} />
      </div>
    </TimerControllerProvider>
  )
}

export default App
