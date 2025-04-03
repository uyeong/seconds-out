import { memo } from 'react';
import { clsx } from 'clsx';

import { Button } from '~/components/ui/button';
import { useEventCallback } from '~/hooks';

import { useTimerController } from '../../providers';
import PlayIcon from './icons/Play';
import PauseIcon from './icons/Pause';
import StopIcon from './icons/Stop';

import css from './Controls.module.scss';

import type { FC } from 'react';

interface Props {
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
}

const Controls: FC<Props> = ({ onPlay, onPause, onStop }) => {
  const { playing } = useTimerController();
  const handleTogglePlay = useEventCallback(() => {
    if (playing) {
      onPause();
    } else {
      onPlay();
    }
  });
  return (
    <div className={css.root}>
      <div className={css.inside}>
        <Button
          className={css.button}
          variant="outline"
          size="lg"
          aria-label="Stop"
          onClick={onStop}
        >
          <StopIcon />
        </Button>
        <Button
          className={clsx(css.button, css.play)}
          variant="default"
          size="lg"
          onClick={handleTogglePlay}
        >
          {playing ? (
            <>
              <PauseIcon />
              <span>PAUSE</span>
            </>
          ) : (
            <>
              <PlayIcon />
              <span>START</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default memo(Controls); 
