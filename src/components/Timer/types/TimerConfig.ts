type ThemeName =
  | 'base'
  | 'baseDark'
  | 'linen'
  | 'leaflight'
  | 'umber'
  | 'metro'
  | 'azure'
  | 'brasa'
  | 'vanta'
  | 'lucid'
  | 'mellow'
  | 'noctis'
  | 'beast'
  | 'boxer';
type BellName = 'none' | 'classic' | 'digital';

interface TimerConfig {
  theme: ThemeName;
  bell: BellName;
  volume: number;
  boost: number; // 볼륨 증폭 배율 (1.0 = 기본, 최대 3.0)
  durations: {
    setupSeconds: number;
    restSeconds: number;
    roundSeconds: number;
  };
  rounds: {
    count: number;
  };
}

export default TimerConfig;
export type { ThemeName, BellName };
