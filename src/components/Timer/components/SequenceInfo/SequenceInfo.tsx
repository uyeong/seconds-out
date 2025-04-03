import { useEffect, useRef, memo } from "react";

import { cn } from "~/lib/utils.ts";
import { useMounted } from "~/hooks";

import { useTimerSequence } from "../../providers";

import css from "./SequenceInfo.module.scss";

const SequenceInfo = () => {
  const mounted = useMounted();
  const { sequence, current } = useTimerSequence();
  const rootRef = useRef<HTMLUListElement>(null);
  const activeItemRef = useRef<HTMLLIElement>(null);
  // 활성 항목을 컨테이너 중앙에 배치하는 네이티브 방식
  useEffect(() => {
    if (rootRef.current && activeItemRef.current) {
      const container = rootRef.current;
      const activeItem = activeItemRef.current;
      // 요소들의 위치 정보 가져오기
      const containerRect = container.getBoundingClientRect();
      const activeItemRect = activeItem.getBoundingClientRect();
      // 컨테이너 내부 상대 위치 계산
      const relativeTop = activeItemRect.top - containerRect.top + container.scrollTop;
      const newScrollTop = relativeTop - (containerRect.height / 2) + (activeItemRect.height / 2);
      // 스크롤 적용
      container.scrollTo({
        top: Math.max(0, newScrollTop),
        behavior: mounted ? 'smooth' : 'auto'
      });
    }
  }, [current, mounted]);

  // 현재 활성화된 아이템의 인덱스 찾기
  const activeIndex = sequence.findIndex(item => item === current);

  return (
    <ul className={cn(css.root, { [css.mounted]: mounted })} ref={rootRef}>
      {sequence.map((item, index) => {
        // 활성화된 아이템과의 거리 계산
        const distance = Math.abs(index - activeIndex);
        return (
          <li
            key={item.type + index}
            className={cn(
              css.item,
              {
                [css.active]: item === current,
                [css.distance1]: distance === 1,
                [css.distance2]: distance === 2,
                [css.distance3]: distance === 3,
                [css.distance4]: distance >= 4
              }
            )}
            ref={item === current ? activeItemRef : undefined}
          >
            <span className={css.sequenceType}>
              {item.type === 'round' ? `ROUND ${item.round}` : item.type.toUpperCase()}
            </span>
          </li>
        );
      })}
    </ul>
  );
};

export default memo(SequenceInfo);
