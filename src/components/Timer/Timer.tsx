import { useEffect, useRef, useState } from 'react';

import { useEventCallback } from '~/hooks';

import Controls from './components/Controls';
import Meter from './components/Meter';
import SequenceInfo from './components/SequenceInfo';
import Setting from './components/Setting';
import {
  useCountdownEffect,
  useBellSounds,
  useTimerSequence,
  useTimerController,
} from './hooks';
import themes from './themes';
import { setThemeColor } from './utils';

import css from './Timer.module.scss';

import type { TimerConfig } from './types';
import type { FC, CSSProperties } from 'react';

const CIRCUMFERENCE = 2 * Math.PI * 47;

interface Props {
  config: TimerConfig;
  active?: boolean;
  onRemove?: () => void;
}

const Timer: FC<Props> = ({ config, active = false, onRemove }) => {
  const { sequence, currentSeqIndex, next, reset, hasNext } =
    useTimerSequence(config);
  const { stopped, paused, playing, play, pause, stop } = useTimerController();
  const { resumePaused, pausePlaying, stopSounds, playOnTiming } =
    useBellSounds(config.bell, config.volume ?? 0.5, config.boost ?? 1);
  const [currentSeconds, setCurrentSeconds] = useState(0);
  const [settingOpen, setSettingOpen] = useState(false);
  const gaugeRef = useRef<SVGCircleElement>(null);
  const settingPaused = useRef(false);
  const current = sequence[currentSeqIndex];
  const theme = themes.find(({ name }) => name === config.theme) || themes[0];
  const handleClickPlay = useEventCallback(() => {
    if (paused) {
      play();
      resumePaused();
      return;
    }
    reset();
    play();
  });
  const handleClickPause = useEventCallback(() => {
    pause();
    pausePlaying();
  });
  const handleClickStop = useEventCallback(() => {
    reset();
    stop();
    stopSounds();
    setCurrentSeconds(0);
    gaugeRef.current?.setAttribute('stroke-dashoffset', '0px');
  });
  const handleClickOpenSetting = useEventCallback(() => {
    setSettingOpen(true);
    if (playing) {
      handleClickPause();
      settingPaused.current = true;
    }
  });
  const handleClickCloseSetting = useEventCallback(() => {
    setSettingOpen(false);
    if (settingPaused.current) {
      handleClickPlay();
      settingPaused.current = false;
    }
  });
  // 재생 중 화면 꺼짐 방지 (Wake Lock API)
  useEffect(() => {
    if (!active || !playing) return;
    let wakeLock: WakeLockSentinel | null = null;
    navigator.wakeLock?.request('screen').then((lock) => {
      wakeLock = lock;
    });
    return () => {
      wakeLock?.release();
    };
  }, [active, playing]);
  useEffect(() => {
    if (active) {
      setThemeColor(theme.bgColor);
    } else {
      handleClickStop();
    }
  }, [active, handleClickStop, theme.bgColor]);
  useEffect(() => {
    handleClickStop();
  }, [config, handleClickStop]);
  useCountdownEffect(
    {
      current,
      paused,
      stopped,
    },
    (seconds, progress) => {
      if (!active) {
        return;
      }
      setCurrentSeconds(Math.floor(seconds));
      playOnTiming(current, seconds);
      gaugeRef.current?.setAttribute(
        'stroke-dashoffset',
        `${progress * CIRCUMFERENCE}px`,
      );
      if (progress === 1) {
        if (hasNext()) {
          next();
        } else {
          stop();
        }
      }
    },
  );
  return (
    <div
      className={css.root}
      style={
        {
          '--background': theme.bgColor,
          '--bg-pattern':
            'bgPattern' in theme && theme.bgPattern
              ? `url(${import.meta.env.BASE_URL}patterns/${theme.bgPattern})`
              : 'none',
          '--bg-pattern-opacity':
            'bgPatternOpacity' in theme ? theme.bgPatternOpacity : 0,
          '--bg-pattern-size':
            'bgPatternSize' in theme ? theme.bgPatternSize : 'auto',
          '--text-color': theme.textColor,
          '--chart-setup': theme.chart.setup,
          '--chart-rest': theme.chart.rest,
          '--chart-round': theme.chart.round,
          '--btn-bg-color': theme.button.bgColor,
          '--btn-text-color': theme.button.textColor,
        } as CSSProperties
      }
    >
      {config.name && (
        <div className={css.name}>
          <span>{config.name}</span>
        </div>
      )}
      <div className={css.inside}>
        <div className={css.left}>
          <Meter
            gaugeRef={gaugeRef}
            sequence={sequence}
            current={current}
            seconds={currentSeconds}
          />
        </div>
        <div className={css.right}>
          <SequenceInfo sequence={sequence} current={current} />
          <Controls
            playing={playing}
            onPlay={handleClickPlay}
            onPause={handleClickPause}
            onStop={handleClickStop}
            onSetting={handleClickOpenSetting}
          />
        </div>
        <Setting
          open={settingOpen}
          config={config}
          onClose={handleClickCloseSetting}
          onRemove={onRemove}
        />
      </div>
    </div>
  );
};

export default Timer;
