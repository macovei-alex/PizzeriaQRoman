import { useCallback, useRef } from "react";
import { ScrollView } from "react-native";

export default function useScrollRef() {
  const scrollRef = useRef<ScrollView>(null);

  const scrollToStart = useCallback(() => {
    scrollRef.current?.scrollTo({ x: 0, y: 0, animated: true });
  }, [scrollRef]);

  const scrollToEnd = useCallback(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [scrollRef]);

  const scrollToPos = useCallback(
    ({ x, y }: { x?: number; y?: number }) => {
      scrollRef.current?.scrollTo({ x, y, animated: true });
    },
    [scrollRef]
  );

  return { scrollRef, scrollToStart, scrollToEnd, scrollToPos };
}
