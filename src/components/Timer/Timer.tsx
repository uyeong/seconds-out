import clsx from "clsx";
import { useRef, useState } from "react";

import { useCountdownEffect } from './hooks';
import { formatTime } from './utils';
import { useTimerController } from './providers';

import css from './Timer.module.scss';

import type { FC } from 'react';

const CIRCUMFERENCE = 2 * Math.PI * 48;

interface Props {
  seconds: number;
  onComplete?: () => void;
}

const Timer: FC<Props> = ({ seconds: initialSeconds }) => {
  const { playing, play, pause, stop } = useTimerController();
  const [remaining, setRemaining] = useState(initialSeconds);
  const gaugeRef = useRef<SVGCircleElement>(null);
  useCountdownEffect(initialSeconds, (seconds, progress) => {
    setRemaining(initialSeconds - seconds);
    if (gaugeRef.current) {
      gaugeRef.current.setAttribute('stroke-dashoffset', `${progress * CIRCUMFERENCE}px`);
    }
    if (progress === 1) {
      stop();
    }
  });
  return (
    <div className={css.timer}>
      <div className={clsx(css.root, {[css.playing]: playing})}>
        <svg width="200" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="48" fill="none" stroke="#fff" strokeWidth={0.5}/>
          <circle
            ref={gaugeRef}
            cx="50"
            cy="50"
            r="48"
            fill="none"
            stroke="blue"
            strokeWidth={4}
            strokeDasharray={CIRCUMFERENCE}
            transform="rotate(-90 50 50)"
            className={css.progress}
          />
        </svg>
        <span className={css.time}>{formatTime(remaining)}</span>
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
