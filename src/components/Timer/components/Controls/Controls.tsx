import { memo } from 'react';

import { Button } from '~/components/ui/button';
import { useEventCallback } from '~/hooks';
import { cn } from '~/lib/utils';

import PauseIcon from './icons/Pause';
import PlayIcon from './icons/Play';
import SettingIcon from './icons/Setting';
import StopIcon from './icons/Stop';

import css from './Controls.module.scss';

import type { FC } from 'react';

interface Props {
  playing?: boolean;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  onSetting: () => void;
}

const Controls: FC<Props> = ({
  playing,
  onPlay,
  onPause,
  onStop,
  onSetting,
}) => {
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
          className={cn(css.button, css.play)}
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
        <Button
          className={cn(css.button, css.setting)}
          variant="outline"
          size="lg"
          aria-label="Setting"
          onClick={onSetting}
        >
          <SettingIcon />
        </Button>
      </div>
    </div>
  );
};

export default memo(Controls);
