import { useRef } from "react";

export function useScrollRef() {
  const scrollRef = useRef();

  const scrollToStart = () => {
    scrollRef.current?.scrollTo({ x: 0, y: 0, animated: true });
  };
  const scrollToEnd = () => {
    scrollRef.current?.scrollToEnd({ animated: true });
  };
  const scrollToPos = ({ x, y }) => {
    scrollRef.current?.scrollTo({ x, y, animated: true });
  };

  return { scrollRef, scrollToStart, scrollToEnd, scrollToPos };
}
