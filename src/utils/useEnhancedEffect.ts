import { useLayoutEffect, useEffect } from 'react';

/**
 * https://github.com/mui-org/material-ui/blob/next/packages/mui-utils/src/useEnhancedEffect.js
 */
const useEnhancedEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export default useEnhancedEffect;
