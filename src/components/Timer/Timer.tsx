import { useRef, useState } from "react";

import { Button } from '~/components/ui/button';
import { cn } from "~/lib/utils.ts";
import { useEventCallback } from "~/utils";

import { useCountdownEffect } from './hooks';
import { formatTime } from './utils';

import { useTimerController, useTimerSequence } from './providers';

import css from './Timer.module.scss';
import type { FC } from 'react';
import {clsx} from "clsx";

const CIRCUMFERENCE = 2 * Math.PI * 47;

const Timer: FC = () => {
  const { sequence, current, next, reset, hasNext } = useTimerSequence();
  const { playing, stopped, paused, play, pause, stop } = useTimerController();
  const currentIndex = sequence.indexOf(current);
  const [currentSeconds, setCurrentSeconds] = useState(0);
  const gaugeRef = useRef<SVGCircleElement>(null);
  const handleClickPlay = useEventCallback(() => {
    if (stopped) {
      reset();
      play();
    }
    if (playing) {
      pause();
    }
    if (paused) {
      play();
    }
  });
  const handleClickStop = useEventCallback(() => {
    reset();
    stop();
    setCurrentSeconds(0);
    gaugeRef.current?.setAttribute('stroke-dashoffset', `0px`);
  });
  useCountdownEffect(current.duration, (seconds, progress) => {
    setCurrentSeconds(seconds);
    gaugeRef.current?.setAttribute('stroke-dashoffset', `${progress * CIRCUMFERENCE}px`);
    if (progress === 1) {
      if (hasNext()) {
        next();
      } else {
        stop();
      }
    }
  });
  return (
    <div className={css.root}>
      <div className={css.meter}>
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <g
            fill="none"
            strokeWidth={6}
            strokeDasharray={CIRCUMFERENCE}
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
          >
            <circle
              className={css.progress}
              cx="50"
              cy="50"
              r="47"
              strokeWidth={.5}
            />
            {sequence[currentIndex + 1] && (
              <circle
                className={cn(css.progress, {
                  [css.setup]: sequence[currentIndex + 1].type === 'setup',
                  [css.round]: sequence[currentIndex + 1].type === 'round',
                  [css.rest]: sequence[currentIndex + 1].type === 'rest',
                })}
                cx="50"
                cy="50"
                r="47"
              />
            )}
            <circle
              ref={gaugeRef}
              className={cn(css.progress, {
                [css.setup]: current.type === 'setup',
                [css.round]: current.type === 'round',
                [css.rest]: current.type === 'rest',
              })}
              cx="50"
              cy="50"
              r="47"
            />
          </g>
        </svg>
        <time className={css.time}>{formatTime(current.duration - currentSeconds)}</time>
      </div>
      <div className={css.sequenceInfo}>
        <span className={css.sequenceType}>{current.type}</span>
        {current.round && <span className={css.round}>Round {current.round}</span>}
      </div>
      <div className={css.controls}>
        <Button className={css.button} variant="outline" size="icon" onClick={handleClickStop}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            stroke="currentColor"
          >
            <rect width="16" height="16" x="4" y="4"/>
          </svg>
          <span className="sr-only">STOP</span>
        </Button>
        <Button className={clsx(css.button, css.play)} variant="default" onClick={handleClickPlay}>
          {playing ? (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="6" x2="6" y1="4" y2="20"/>
                <line x1="18" x2="18" y1="4" y2="20"/>
              </svg>
              <span>PAUSE</span>
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
              <span>START</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default Timer; 
