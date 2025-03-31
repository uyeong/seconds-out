import { useEffect, useRef } from "react";
import { useTimerController } from "../providers";

const useCountdownEffect = (seconds: number, callback: (elapsed: number, progress: number) => void) => {
  const { paused, stopped } = useTimerController();
  const frameIdRef = useRef(0);
  const pastTimeRef = useRef(0);
  useEffect(() => {
    window.cancelAnimationFrame(frameIdRef.current);
    pastTimeRef.current = 0;
  }, [seconds]);
  useEffect(() => {
    if (stopped) {
      window.cancelAnimationFrame(frameIdRef.current);
      pastTimeRef.current = 0;
      callback(0, 0);
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
      const elapsed = Math.floor(progress * seconds);
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
  }, [seconds, callback, paused, stopped]);
};

export default useCountdownEffect;
