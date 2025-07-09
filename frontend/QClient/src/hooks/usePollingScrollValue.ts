import React, { useEffect, useState } from "react";

export function usePollingScrollValue(scrollValueReference: React.RefObject<number>, interval: number = 200) {
  const [scrollValue, setScrollValue] = useState(scrollValueReference.current);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (scrollValueReference.current !== scrollValue) {
        setScrollValue(scrollValueReference.current);
      }
    }, interval);
    return () => clearInterval(intervalId);
  }, [scrollValueReference, scrollValue, interval]);

  return scrollValue;
}
