import { useEffect, useState } from 'react';

function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    let rafId: number;
    if (!mounted) {
      // 마운트 된 시점에 즉각 포커스나 CSS 애니메이션을 처리하면 반응하지 않을 수 있음
      // 따라서 해당 상태 갱신을 다름 프레임 레이트 시점으로 미룸
      rafId = window.requestAnimationFrame(() => {
        setMounted(true);
      });
    }
    return () => {
      window.cancelAnimationFrame(rafId);
    };
  }, [mounted]);
  return mounted;
}

export default useMounted;
