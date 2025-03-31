import { Howl } from 'howler';

import { useEventCallback } from '~/hooks';

import bells from '../bells';

import type { TimerSequence, BellName } from '../types';
import type { HowlOptions } from 'howler';

class BellSound {
  private sound: Howl;
  private state: 'playing' | 'paused' | 'stopped';
  public readonly offsetSeconds: number;

  constructor(options: HowlOptions & { offsetSeconds: number }) {
    this.sound = new Howl(options);
    this.state = 'stopped';
    this.offsetSeconds = options.offsetSeconds;
    this.sound.on('play', () => (this.state = 'playing'));
    this.sound.on('pause', () => (this.state = 'paused'));
    this.sound.on('stop', () => (this.state = 'stopped'));
    this.sound.on('end', () => (this.state = 'stopped'));
  }

  public play(volume?: number) {
    if (volume !== undefined) {
      this.sound.volume(volume);
    }
    this.sound.play();
  }

  public pause() {
    this.sound.pause();
  }

  public stop() {
    this.sound.stop();
  }

  public playing() {
    return this.sound.playing();
  }

  public isPaused() {
    return this.state === 'paused';
  }

  public isPlaying() {
    return this.state === 'playing';
  }

  public isStopped() {
    return this.state === 'stopped';
  }
}

const bellSounds = bells.map((bell) => ({
  name: bell.name,
  sounds: bell.sounds
    ? bell.sounds.map(
        (sound) =>
          new BellSound({
            src: sound.src,
            offsetSeconds: sound.offsetSeconds,
          }),
      )
    : null,
}));

const useBellSounds = (bellName: BellName, volume: number) => {
  const bell = bellSounds.find(({ name }) => name === bellName);
  const bellSoundPair = bell ? bell.sounds : null;
  const getBySequence = useEventCallback((sequence: TimerSequence) => {
    if (!bellSoundPair) {
      return null;
    }
    if (sequence.type === 'setup' || sequence.type === 'rest') {
      return bellSoundPair[0];
    }
    if (sequence.type === 'round') {
      return bellSoundPair[1];
    }
  });
  const getByState = useEventCallback(
    (state: 'playing' | 'paused' | 'stopped') => {
      if (!bellSoundPair) {
        return null;
      }
      return (
        bellSoundPair.find((sound) => {
          if (state === 'playing') {
            return sound.isPlaying();
          }
          if (state === 'paused') {
            return sound.isPaused();
          }
          if (state === 'stopped') {
            return sound.isStopped();
          }
          return false;
        }) ?? null
      );
    },
  );
  // 일시 정지된 사운드 재생
  const resumePaused = useEventCallback(() => {
    const pausedSound = getByState('paused');
    if (pausedSound) {
      pausedSound.play(volume);
      return true;
    }
    return false;
  });
  // 재생 중인 사운드 일시 정지
  const pausePlaying = useEventCallback(() => {
    const playingSound = getByState('playing');
    if (playingSound) {
      playingSound.pause();
      return true;
    }
    return false;
  });
  // 재생 중이거나 일시 정지된 사운드 모두 정지
  const stopSounds = useEventCallback(() => {
    let stopped = false;
    ['playing', 'paused'].forEach((state) => {
      const sound = getByState(state as 'playing' | 'paused');
      if (sound) {
        sound.stop();
        stopped = true;
      }
    });
    return stopped;
  });
  // 현재 타이밍에 재생해야 할 사운드 찾아 재생
  const playOnTiming = useEventCallback(
    (sequence: TimerSequence, remainingSeconds: number) => {
      const sound = getBySequence(sequence);
      if (
        !sound ||
        sound.playing() ||
        sequence.duration - remainingSeconds > sound.offsetSeconds
      ) {
        return;
      }
      sound.play(volume);
    },
  );
  return {
    resumePaused,
    pausePlaying,
    stopSounds,
    playOnTiming,
  };
};

export default useBellSounds;
