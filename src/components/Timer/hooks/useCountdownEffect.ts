import { useEffect, useRef } from 'react';

import type { TimerSequence } from '../types';

interface Options {
  current: TimerSequence;
  paused?: boolean;
  stopped?: boolean;
}

const useCountdownEffect = (
  options: Options,
  callback: (elapsed: number, progress: number) => void,
) => {
  const { current, paused = false, stopped = false } = options;
  const frameIdRef = useRef(0);
  const pastTimeRef = useRef(0);
  const seconds = current.duration;
  useEffect(() => {
    window.cancelAnimationFrame(frameIdRef.current);
    pastTimeRef.current = 0;
  }, [current]);
  useEffect(() => {
    if (stopped) {
      window.cancelAnimationFrame(frameIdRef.current);
      pastTimeRef.current = 0;
      return;
    }
    if (paused) {
      window.cancelAnimationFrame(frameIdRef.current);
      return;
    }
    const duration = seconds * 1000;
    let startTime = 0;
    const animate = (timestamp: number) => {
      if (!startTime) {
        startTime = timestamp - pastTimeRef.current;
      }
      const deltaTime = timestamp - startTime;
      const progress = deltaTime / duration;
      const elapsed = progress * seconds;
      if (deltaTime >= duration) {
        callback(seconds, 1);
        window.cancelAnimationFrame(frameIdRef.current);
        return;
      }
      callback(elapsed, progress);
      pastTimeRef.current = deltaTime;
      frameIdRef.current = requestAnimationFrame(animate);
    };
    frameIdRef.current = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(frameIdRef.current);
    };
  }, [paused, stopped, seconds, callback]);
};

export default useCountdownEffect;
