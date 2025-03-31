import * as Popover from '@radix-ui/react-popover';
import * as ScrollArea from '@radix-ui/react-scroll-area';
import { ChevronDown, Clock } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

import { Card, CardContent } from '~/components/ui/card';
import { useEventCallback } from '~/hooks';
import { cn } from '~/lib/utils';

import type { FC } from 'react';

interface TimeSelectorProps {
  label: string;
  value: string;
  options: string[];
  disabled?: boolean;
  className?: string;
  onChange: (val: string) => void;
}

interface Props {
  className?: string;
  value?: number; // 초 단위로 받음 (예: 90초 = 1분 30초)
  onChange?: (seconds: number) => void; // 초 단위로 반환
}

const minuteOptions = Array.from({ length: 61 }, (_, i) =>
  i.toString().padStart(2, '0'),
);
const secondOptions = Array.from({ length: 60 }, (_, i) =>
  i.toString().padStart(2, '0'),
);

// 초를 분과 초로 변환
const secondsToMinutesAndSeconds = (
  totalSeconds: number,
): { minutes: string; seconds: string } => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return {
    minutes: minutes.toString().padStart(2, '0'),
    seconds: seconds.toString().padStart(2, '0'),
  };
};

// 분과 초를 초로 변환
const minutesAndSecondsToSeconds = (
  minutes: string,
  seconds: string,
): number => {
  return parseInt(minutes) * 60 + parseInt(seconds);
};

const TimeSelector: FC<TimeSelectorProps> = ({
  label,
  value,
  options,
  disabled = false,
  className,
  onChange,
}) => {
  const containerRef = useRef<HTMLUListElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const isInitialScrollRef = useRef(true);
  // 선택된 값이 가운데로 오도록 스크롤 조정 (애니메이션 없이)
  const scrollToCenterInstant = useEventCallback(() => {
    if (containerRef.current && viewportRef.current && !disabled) {
      const index = options.indexOf(value);
      const selectedItem = itemRefs.current[index];
      if (selectedItem) {
        const viewportHeight = viewportRef.current.clientHeight;
        const itemHeight = selectedItem.clientHeight;
        const itemTop = selectedItem.offsetTop;
        // 선택된 항목이 중앙에 오도록 스크롤 위치 계산
        const targetScrollTop = itemTop - viewportHeight / 2 + itemHeight / 2;
        viewportRef.current.scrollTop = targetScrollTop; // 즉시 스크롤 (애니메이션 없음)
      }
    }
  });
  // 선택된 값이 가운데로 오도록 스크롤 조정 (애니메이션 사용)
  const scrollToCenterSmooth = useEventCallback(() => {
    if (containerRef.current && viewportRef.current && !disabled) {
      const index = options.indexOf(value);
      const selectedItem = itemRefs.current[index];
      if (selectedItem) {
        const viewportHeight = viewportRef.current.clientHeight;
        const itemHeight = selectedItem.clientHeight;
        const itemTop = selectedItem.offsetTop;
        // 선택된 항목이 중앙에 오도록 스크롤 위치 계산
        const targetScrollTop = itemTop - viewportHeight / 2 + itemHeight / 2;
        viewportRef.current.scrollTo({
          top: targetScrollTop,
          behavior: 'smooth',
        });
      }
    }
  });
  // 값이 변경될 때 스크롤 처리
  useEffect(() => {
    if (isInitialScrollRef.current) {
      // 첫 렌더링 시 애니메이션 없이 스크롤
      scrollToCenterInstant();
      isInitialScrollRef.current = false;
    } else {
      // 이후 값 변경 시 부드러운 스크롤 사용
      scrollToCenterSmooth();
    }
  }, [value, options, disabled, scrollToCenterInstant, scrollToCenterSmooth]);
  return (
    <div className={cn('flex-1', className)}>
      <div className="text-xs font-medium text-muted-foreground mb-1.5">
        {label}
      </div>
      <ScrollArea.Root className="w-full h-32 rounded-md border">
        <ScrollArea.Viewport
          ref={viewportRef}
          className="h-full"
          style={{ scrollSnapType: 'y mandatory' }}
        >
          <ul ref={containerRef} className="flex flex-col items-center">
            {options.map((val, idx) => (
              <li
                key={val}
                ref={(el) => (itemRefs.current[idx] = el)}
                onClick={() => !disabled && onChange(val)}
                className={cn(
                  'w-full py-1.5 text-center cursor-pointer text-sm transition-colors',
                  disabled
                    ? 'text-muted cursor-not-allowed'
                    : 'hover:bg-accent/50',
                  val === value && 'font-medium text-primary bg-primary/10',
                )}
                style={{ scrollSnapAlign: 'center' }}
              >
                {val}
              </li>
            ))}
          </ul>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar
          orientation="vertical"
          className="flex select-none touch-none p-0.5 bg-transparent transition-colors duration-150 ease-out hover:bg-muted-foreground/10 data-[orientation=vertical]:w-1.5 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-1.5"
        >
          <ScrollArea.Thumb className="flex-1 bg-muted-foreground/50 rounded-full relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]" />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>
    </div>
  );
};

const DurationPicker: FC<Props> = ({
  className,
  value = 90, // 기본값 1분 30초
  onChange,
}) => {
  // 초 단위 값을 분:초로 변환하여 상태 초기화
  const initialValues = secondsToMinutesAndSeconds(value);
  const [minutes, setMinutes] = useState(initialValues.minutes);
  const [seconds, setSeconds] = useState(initialValues.seconds);
  const [open, setOpen] = useState(false);
  const isMaxMinute = minutes === '60';
  // 내부적으로 값이 변경될 때 외부 onChange 호출
  const handleMinutesChange = (value: string) => {
    setMinutes(value);
    if (onChange) {
      onChange(minutesAndSecondsToSeconds(value, seconds));
    }
  };
  const handleSecondsChange = useEventCallback((value: string) => {
    setSeconds(value);
    if (onChange) {
      onChange(minutesAndSecondsToSeconds(minutes, value));
    }
  });
  // 분이 60일 때 초는 항상 00으로 설정
  useEffect(() => {
    if (isMaxMinute && seconds !== '00') {
      handleSecondsChange('00');
    }
  }, [isMaxMinute, seconds, handleSecondsChange]);
  // 외부에서 값이 변경될 경우 내부 상태 업데이트
  useEffect(() => {
    const { minutes: mins, seconds: secs } = secondsToMinutesAndSeconds(value);
    setMinutes(mins);
    setSeconds(secs);
  }, [value]);
  return (
    <div className={cn('w-full sm:w-auto', className)}>
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>
          <button
            className={cn(
              'w-full flex items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
              'min-w-[140px] sm:min-w-[160px] max-w-[300px]',
              open && 'ring-2 ring-ring ring-offset-2',
            )}
          >
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>
                {minutes}:{seconds}
              </span>
            </div>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </button>
        </Popover.Trigger>
        <Popover.Content
          className={cn(
            'bg-popover text-popover-foreground relative z-50 min-w-[8rem] overflow-hidden rounded-md border shadow-md',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
            'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2',
            'data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
            'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
          )}
          sideOffset={5}
          align="end"
          avoidCollisions
        >
          <Card className="border-0 shadow-none">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <TimeSelector
                  label="Minutes"
                  value={minutes}
                  options={minuteOptions}
                  onChange={handleMinutesChange}
                  className="min-w-[100px]"
                />
                <div className="text-xl font-medium text-foreground self-center mt-4">
                  :
                </div>
                <TimeSelector
                  label="Seconds"
                  value={seconds}
                  options={secondOptions}
                  onChange={handleSecondsChange}
                  disabled={isMaxMinute}
                  className="min-w-[100px]"
                />
              </div>
            </CardContent>
          </Card>
        </Popover.Content>
      </Popover.Root>
    </div>
  );
};

export { DurationPicker };
