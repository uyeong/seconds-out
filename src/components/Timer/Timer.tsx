import { useCountdown } from './hooks';
import { formatTime } from './utils';
import { useTimerController } from './providers';

import css from './Timer.module.scss';

import type { FC } from "react";

const CIRCUMFERENCE = 2 * Math.PI * 48;

interface Props {
  seconds: number;
  onComplete?: () => void;
}

const Timer: FC<Props> = ({ seconds: initialSeconds }) => {
  const { play, pause, stop } = useTimerController();
  const seconds = useCountdown(initialSeconds);
  const progress = ((initialSeconds - seconds) / initialSeconds) * CIRCUMFERENCE;
  return (
    <div className={css.timer}>
      <div className={css.root}>
        <svg width="200" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="48" fill="none" stroke="#fff" strokeWidth={0.5}/>
          <circle
            cx="50"
            cy="50"
            r="48"
            fill="none"
            stroke="blue"
            strokeWidth={4}
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={progress}
            transform="rotate(-90 50 50)"
            className={css.progress}
          />
        </svg>
        <span className={css.time}>{formatTime(seconds)}</span>
        <div>
          <button onClick={stop}>정지</button>
          <button onClick={pause}>멈춤</button>
          <button onClick={play}>재생</button>
        </div>
      </div>
    </div>
  );
};

export default Timer;
export type { Props };
