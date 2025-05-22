import { useCallback, useState } from "react";

export function useScrollOffsets<TKey extends number | string | symbol>() {
  const [offsets, setOffsets] = useState<Record<TKey, number>>({} as Record<TKey, number>);

  const addOffset = useCallback((key: TKey, offset: number) => {
    setOffsets((prev) => ({ ...prev, [key]: offset }));
  }, []);

  return { offsets, addOffset };
}
