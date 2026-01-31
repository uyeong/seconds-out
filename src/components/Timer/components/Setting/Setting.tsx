import { PlusCircle, Check, Trash2 } from 'lucide-react';
import { memo, useState, useEffect, useRef } from 'react';

import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';
import { DialogContent } from '~/components/ui/dialog';
import { DurationPicker } from '~/components/ui/duration-picker';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { Slider } from '~/components/ui/slider';
import { useEventCallback } from '~/hooks';
import { cn } from '~/lib/utils';
import { useTimerConfigs } from '~/providers';

import bells from '../../bells';
import themes from '../../themes';

import css from './Setting.module.scss';

import type { TimerConfig } from '../../types';
import type { FC, ChangeEvent } from 'react';

interface Props {
  config: TimerConfig;
  open: boolean;
  onClose?: () => void;
}

const Setting: FC<Props> = ({ config: targetConfig, open, onClose }) => {
  const { configs, setSelectedIndex, update, add, remove } = useTimerConfigs();
  const [formState, setFormState] = useState<TimerConfig>({ ...targetConfig });
  const [roundsInput, setRoundsInput] = useState<string>(
    targetConfig.rounds.count.toString(),
  );
  const formRef = useRef<HTMLDivElement>(null);
  const topGradientRef = useRef<HTMLDivElement>(null);
  const bottomGradientRef = useRef<HTMLDivElement>(null);
  const isRemoveDisabled = configs.length <= 1;
  const targetConfigIndex = configs.indexOf(targetConfig);
  const selectedTheme = themes.find((theme) => theme.name === formState.theme);
  const selectedThemeDescription = selectedTheme?.description || '';
  const resetForm = useEventCallback(() => {
    setFormState({ ...targetConfig });
    setRoundsInput(targetConfig.rounds.count.toString());
  });
  useEffect(() => {
    if (open) {
      resetForm();
    }
  }, [open, targetConfig, resetForm]);
  // 스크롤 위치에 따른 그라데이션 표시 (직접 DOM 조작으로 리렌더링 방지)
  const checkScrollGradient = useEventCallback(() => {
    const el = formRef.current;
    if (!el) return;
    const hasMoreContent = el.scrollHeight > el.clientHeight;
    const isAtTop = el.scrollTop <= 10;
    const isAtBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 10;
    topGradientRef.current?.classList.toggle(
      css.visible,
      hasMoreContent && !isAtTop,
    );
    bottomGradientRef.current?.classList.toggle(
      css.visible,
      hasMoreContent && !isAtBottom,
    );
  });
  useEffect(() => {
    if (open) {
      // 모달 열릴 때 스크롤 상태 체크
      setTimeout(checkScrollGradient, 100);
    }
  }, [open, checkScrollGradient]);
  const handleDialogClose = useEventCallback(() => {
    resetForm();
    onClose?.();
  });
  const handleChangeSetupSeconds = useEventCallback((value: number) => {
    handleDurationChange('setupSeconds', value);
  });
  const handleChangeRoundSeconds = useEventCallback((value: number) => {
    handleDurationChange('roundSeconds', value);
  });
  const handleChangeRestSeconds = useEventCallback((value: number) => {
    handleDurationChange('restSeconds', value);
  });
  const handleDurationChange = (
    key: keyof typeof formState.durations,
    value: number,
  ) => {
    setFormState((prev: TimerConfig) => ({
      ...prev,
      durations: {
        ...prev.durations,
        [key]: value,
      },
    }));
  };
  const handleRoundsChange = useEventCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      // 입력 값을 그대로 저장
      setRoundsInput(event.target.value);
      // 유효한 숫자인 경우에만 formState 업데이트
      const value = parseInt(event.target.value);
      if (!isNaN(value) && value > 0) {
        setFormState((prev: TimerConfig) => ({
          ...prev,
          rounds: {
            ...prev.rounds,
            count: value,
          },
        }));
      }
    },
  );
  const handleThemeChange = useEventCallback((value: string) => {
    setFormState((prev: TimerConfig) => ({
      ...prev,
      theme: value as TimerConfig['theme'],
    }));
  });
  const handleBellChange = useEventCallback((value: string) => {
    setFormState((prev: TimerConfig) => ({
      ...prev,
      bell: value as TimerConfig['bell'],
    }));
  });
  const handleVolumeChange = useEventCallback((value: number[]) => {
    setFormState((prev: TimerConfig) => ({
      ...prev,
      volume: value[0] / 100,
    }));
  });
  const handleBoostChange = useEventCallback((value: number[]) => {
    // 슬라이더 값 100-300을 1.0-3.0으로 변환
    setFormState((prev: TimerConfig) => ({
      ...prev,
      boost: value[0] / 100,
    }));
  });
  const handleNameChange = useEventCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setFormState((prev: TimerConfig) => ({
        ...prev,
        name: event.target.value,
      }));
    },
  );
  // 최종 제출 전 유효성 검사
  const validateForm = (): boolean => {
    // 라운드 수 검사
    const roundCount = parseInt(roundsInput);
    if (isNaN(roundCount) || roundCount < 1) {
      alert('The number of rounds must be at least 1.');
      return false;
    }
    // 라운드 수가 유효한 경우 formState 최종 업데이트
    setFormState((prev: TimerConfig) => ({
      ...prev,
      rounds: {
        ...prev.rounds,
        count: roundCount,
      },
    }));
    return true;
  };
  const handleApply = useEventCallback(() => {
    if (!validateForm()) return;

    update(targetConfigIndex, formState);
    onClose?.();
  });
  const handleSaveNew = useEventCallback(() => {
    if (!validateForm()) return;

    add(formState);
    setSelectedIndex(configs.length);
    onClose?.();
  });
  const handleRemove = useEventCallback(() => {
    if (isRemoveDisabled) {
      return;
    }
    if (window.confirm('Do you want to delete this timer setting?')) {
      remove(targetConfigIndex);
      onClose?.();
    }
  });
  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Timer Settings</DialogTitle>
        </DialogHeader>
        <div className={css.formWrapper}>
          <div
            ref={topGradientRef}
            className={cn(css.scrollGradient, css.top)}
          />
          <div
            ref={formRef}
            className={css.setting}
            onScroll={checkScrollGradient}
          >
            <div className={css.item}>
              <Label htmlFor="name" className={css.label}>
                Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Timer name"
                maxLength={20}
                value={formState.name ?? ''}
                onChange={handleNameChange}
              />
            </div>
            <div className={css.item}>
              <Label htmlFor="setup" className={css.label}>
                Setup Time
              </Label>
              <DurationPicker
                value={formState.durations.setupSeconds}
                onChange={handleChangeSetupSeconds}
              />
            </div>
            <div className={css.item}>
              <Label htmlFor="round" className={css.label}>
                Round Time
              </Label>
              <DurationPicker
                value={formState.durations.roundSeconds}
                onChange={handleChangeRoundSeconds}
              />
            </div>
            <div className={css.item}>
              <Label htmlFor="rest" className={css.label}>
                Rest Time
              </Label>
              <DurationPicker
                value={formState.durations.restSeconds}
                onChange={handleChangeRestSeconds}
              />
            </div>
            <div className={css.item}>
              <Label htmlFor="roundCount" className={css.label}>
                Rounds
              </Label>
              <Input
                className={css.numberInput}
                id="roundCount"
                type="number"
                inputMode="numeric"
                pattern="[0-9]*"
                min="1"
                max="99"
                value={roundsInput}
                onChange={handleRoundsChange}
              />
            </div>
            <div className={css.item}>
              <Label htmlFor="theme" className={css.label}>
                Theme
              </Label>
              <div className="w-full">
                <Select
                  value={formState.theme}
                  onValueChange={handleThemeChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Themes</SelectLabel>
                      {themes.map((theme) => (
                        <SelectItem key={theme.name} value={theme.name}>
                          {theme.name.charAt(0).toUpperCase() +
                            theme.name.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {selectedThemeDescription && (
                  <span className={css.description}>
                    {selectedThemeDescription}
                  </span>
                )}
              </div>
            </div>
            <div className={css.item}>
              <Label className={css.label}>Sound</Label>
              <RadioGroup
                value={formState.bell}
                onValueChange={handleBellChange}
                className={css.radioGroup}
              >
                {bells.map((bell) => (
                  <div key={bell.name} className={css.radioItem}>
                    <RadioGroupItem
                      value={bell.name}
                      id={`sound-${bell.name}`}
                    />
                    <Label
                      htmlFor={`sound-${bell.name}`}
                      className={css.smallText}
                    >
                      {bell.name.charAt(0).toUpperCase() + bell.name.slice(1)}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            <div className={css.item}>
              <Label className={css.label}>Volume</Label>
              <Slider
                value={[Math.round(formState.volume * 100) || 50]}
                max={100}
                min={0}
                step={1}
                onValueChange={handleVolumeChange}
              />
            </div>
            <div className={css.item}>
              <Label className={css.label}>
                Boost
                <span className={css.boostValue}>
                  {(formState.boost ?? 1).toFixed(1)}x
                </span>
              </Label>
              <Slider
                value={[Math.round((formState.boost ?? 1) * 100)]}
                max={500}
                min={100}
                step={10}
                onValueChange={handleBoostChange}
              />
            </div>
          </div>
          <div
            ref={bottomGradientRef}
            className={cn(css.scrollGradient, css.bottom)}
          />
        </div>
        <DialogFooter className={css.footer}>
          <div className={css.buttonGroup}>
            <Button
              className={cn(css.button, css.save)}
              variant="outline"
              size="lg"
              onClick={handleSaveNew}
            >
              <PlusCircle />
              Save New
            </Button>
            <Button
              className={cn(css.button, css.apply)}
              variant="default"
              size="lg"
              onClick={handleApply}
            >
              <Check />
              Apply
            </Button>
          </div>
          <Button
            className={cn(css.button, css.remove)}
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            disabled={isRemoveDisabled}
          >
            <Trash2 />
            Remove Timer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default memo(Setting);
