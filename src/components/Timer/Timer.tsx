import { useRef, useState } from "react";

import { useCountdownEffect } from './hooks';
import { formatTime } from './utils';
import { useTimerController, useTimerSequence } from './providers';
import { Button } from '~/components/ui/button';

import css from './Timer.module.scss';

import type { FC } from 'react';

const CIRCUMFERENCE = 2 * Math.PI * 48;

const Timer: FC = () => {
  const { play, pause, stop } = useTimerController();
  const { current: sequence, next, reset, hasNext } = useTimerSequence();
  const { type, duration, round } = sequence;
  const [seconds, setSeconds] = useState(0);
  const gaugeRef = useRef<SVGCircleElement>(null);
  useCountdownEffect(duration, (seconds, progress) => {
    setSeconds(seconds);
    if (gaugeRef.current) {
      gaugeRef.current.setAttribute('stroke-dashoffset', `${progress * CIRCUMFERENCE}px`);
    }
    if (progress === 1) {
      if (hasNext()) {
        next();
      } else {
        stop();
        reset();
      }
    }
  });
  return (
    <div className={css.timer}>
      <div className={css.root}>
        <div className={css.sequenceInfo}>
          <span className={css.sequenceType}>{type}</span>
          {sequence.round && <span className={css.round}>Round {round}</span>}
        </div>
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
        <span className={css.time}>{formatTime(duration - seconds)}</span>
        <div>
          <Button onClick={() => {
            stop();
            reset();
          }}>정지</Button>
          <Button onClick={pause}>멈춤</Button>
          <Button onClick={play}>재생</Button>
        </div>
      </div>
    </div>
  ); 
};
export default Timer; 
