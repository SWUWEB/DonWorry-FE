import { useEffect, useState } from 'react';

// 1분마다 컴포넌트 리렌더링 (남은 대기 시간 최신화를 위함)
export const useNow = (intervalMs: number = 60 * 1000) => {
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      forceUpdate((prev) => prev + 1);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [intervalMs]);
};