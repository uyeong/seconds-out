import { useRef, useCallback } from 'react';

import useEnhancedEffect from './useEnhancedEffect';

/**
 * https://github.com/facebook/react/issues/14099#issuecomment-440013892
 * https://github.com/mui-org/material-ui/blob/next/packages/mui-utils/src/useEventCallback.ts
 */
function useEventCallback<Args extends unknown[], Return>(
  fn: (...args: Args) => Return,
): (...args: Args) => Return {
  const ref = useRef(fn);
  useEnhancedEffect(() => {
    ref.current = fn;
  });
  return useCallback((...args) => ref.current(...args), []);
}

export default useEventCallback;
