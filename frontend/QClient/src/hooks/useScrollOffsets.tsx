import { useCallback, useState } from "react";

export function useScrollOffsets<TKey extends number | string | symbol>() {
  const [offsets, setOffsets] = useState<Map<TKey, number>>(new Map());

  const addOffset = useCallback((key: TKey, offset: number) => {
    setOffsets((prev) => new Map(prev).set(key, offset));
  }, []);

  return { offsets, addOffset };
}
