import { useRef, useState } from "react";

import { useEventCallback } from "~/hooks";

import Header from './components/Header';
import Meter from './components/Meter';
import SequenceInfo from "./components/SequenceInfo";
import Controls from './components/Controls';
import { useCountdownEffect } from './hooks';
import { useTimerController, useTimerSequence } from './providers';

import css from './Timer.module.scss';

import type { FC } from 'react';

const CIRCUMFERENCE = 2 * Math.PI * 47;

const Timer: FC = () => {
  const { current, next, reset, hasNext } = useTimerSequence();
  const { paused, play, pause, stop } = useTimerController();
  const [currentSeconds, setCurrentSeconds] = useState(0);
  const gaugeRef = useRef<SVGCircleElement>(null);
  const handleClickPlay = useEventCallback(() => {
    if (paused) {
      play();
      return;
    }
    reset();
    play();
  });
  const handleClickPause = useEventCallback(() => {
    pause();
  });
  const handleClickStop = useEventCallback(() => {
    reset();
    stop();
    setCurrentSeconds(0);
    gaugeRef.current?.setAttribute('stroke-dashoffset', `0px`);
  });
  useCountdownEffect(current, (seconds, progress) => {
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
      <Meter gaugeRef={gaugeRef} seconds={currentSeconds} />
      <SequenceInfo />
      <Controls onPlay={handleClickPlay} onPause={handleClickPause} onStop={handleClickStop} />
    </div>
  );
};

export default Timer; 
