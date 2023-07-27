import { useState, useEffect, useCallback } from 'react';

interface IWindowsize<T> {
  width?: T;
  height?: T;
}

export default function useWindowSize(): IWindowsize<number> {
  const isWindowopen: boolean = typeof window === 'object';

  // using useCallback over the method to prevent a total re-render everytime the window resizes
  const GetWindowSize = useCallback(() => {
    return {
      width: isWindowopen ? window.innerWidth : undefined,
      height: isWindowopen ? window.innerHeight : undefined,
    };
  }, [isWindowopen]);

  const { width, height } = GetWindowSize();
  const [windowSize, setWindowSize] = useState<{
    width: number | undefined;
    height: number | undefined;
  }>({
    width,
    height,
  });

  function changeWindowSize() {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
  }

  useEffect(() => {
    if (!isWindowopen) return;

    window.addEventListener('resize', changeWindowSize);

    return () => {
      // cleanup, for rerendering prevention
      window.removeEventListener('resize', changeWindowSize);
    };
  }, [changeWindowSize]);

  return windowSize;
}

// useIsClient and useWindowsize hook from usehook does the same thing if you are
// using typescript you can make use of any as preferred one
