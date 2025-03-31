import { useEffect, useRef, memo } from 'react';

import { useMounted } from '~/hooks';
import { cn } from '~/lib/utils.ts';

import { smoothScrollToElement } from '../../utils';

import css from './SequenceInfo.module.scss';

import type { TimerSequence } from '../../types';
import type { FC } from 'react';

interface Props {
  sequence: TimerSequence[];
  current: TimerSequence;
}

const SequenceInfo: FC<Props> = ({ sequence, current }) => {
  const mounted = useMounted();
  const rootRef = useRef<HTMLUListElement>(null);
  const activeItemRef = useRef<HTMLLIElement>(null);
  useEffect(() => {
    if (rootRef.current && activeItemRef.current) {
      const container = rootRef.current;
      const activeItem = activeItemRef.current;
      // 요소들의 위치 정보 가져오기
      const containerRect = container.getBoundingClientRect();
      const activeItemRect = activeItem.getBoundingClientRect();
      // 컨테이너 내부 상대 위치 계산
      const relativeTop =
        activeItemRect.top - containerRect.top + container.scrollTop;
      const newScrollTop =
        relativeTop - containerRect.height / 2 + activeItemRect.height / 2;
      // 스크롤 적용
      smoothScrollToElement(container, newScrollTop, mounted ? 500 : 0);
    }
  }, [current, mounted]);
  const activeIndex = sequence.findIndex((item) => item === current);
  return (
    <div className={cn(css.root, { [css.mounted]: mounted })}>
      <ul ref={rootRef} className={css.inside}>
        {sequence.map((item, index) => {
          // 활성화된 아이템과의 거리 계산
          const distance = Math.abs(index - activeIndex);
          return (
            <li
              key={item.type + index}
              className={cn(css.item, {
                [css.active]: item === current,
                [css.distance]: distance > 0,
              })}
              ref={item === current ? activeItemRef : undefined}
            >
              <span className={css.sequenceType}>{item.name}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default memo(SequenceInfo);
