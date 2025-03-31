import { useEffect, useState, useRef, startTransition } from "react";
import { useTimerController } from "../providers";

const useCountdown = (initialSeconds: number) => {
  const { paused, stopped } = useTimerController();
  const [seconds, setSeconds] = useState(initialSeconds);
  const frameRef = useRef(0);
  const pastTimeRef = useRef(0);
  useEffect(() => {
    if (stopped) {
      window.cancelAnimationFrame(frameRef.current);
      setSeconds(initialSeconds);
      pastTimeRef.current = 0;
      return;
    }
    if (paused) {
      window.cancelAnimationFrame(frameRef.current);
      return;
    }
    const animate = (timestamp: number) => {
      if (!pastTimeRef.current) {
        pastTimeRef.current = timestamp;
      }
      const deltaTime = timestamp - pastTimeRef.current;
      if (deltaTime >= 1000) {
        startTransition(() => {
          setSeconds(prev => {
            const newSeconds = Math.max(0, prev - 1);
            if (newSeconds === 0) {
              window.cancelAnimationFrame(frameRef.current);
              return 0;
            }
            return newSeconds;
          });
        });
        pastTimeRef.current = timestamp;
      }
      frameRef.current = requestAnimationFrame(animate);
    }; 
    frameRef.current = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(frameRef.current);
    };
  }, [initialSeconds, paused, stopped]);
  return seconds;
}; 

export default useCountdown;
