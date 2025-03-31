import { cn } from '~/lib/utils';

import { formatTime } from '../../utils';

import css from './Meter.module.scss';

import type { TimerSequence } from '../../types';
import type { FC, RefObject } from 'react';

const CIRCUMFERENCE = 2 * Math.PI * 47;

interface Props {
  gaugeRef?: RefObject<SVGCircleElement>;
  sequence: TimerSequence[];
  current: TimerSequence;
  seconds: number;
}

const Meter: FC<Props> = ({ gaugeRef, sequence, current, seconds }) => {
  const currentIndex = sequence.indexOf(current);
  return (
    <div className={css.root}>
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
            strokeWidth={0.5}
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
      <time className={css.time}>{formatTime(current.duration - seconds)}</time>
    </div>
  );
};

export default Meter;
