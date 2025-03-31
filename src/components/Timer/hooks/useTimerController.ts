import { useState } from 'react';

import { useEventCallback } from '~/hooks';

const useTimerController = () => {
  const [state, setState] = useState({ stopped: true, paused: false });
  const playing = !state.stopped && !state.paused;
  const play = useEventCallback(() =>
    setState({ stopped: false, paused: false }),
  );
  const pause = useEventCallback(() =>
    setState((prev) => ({ ...prev, paused: true })),
  );
  const stop = useEventCallback(() =>
    setState({ stopped: true, paused: false }),
  );
  return {
    ...state,
    playing,
    play,
    pause,
    stop,
  };
};

export default useTimerController;
