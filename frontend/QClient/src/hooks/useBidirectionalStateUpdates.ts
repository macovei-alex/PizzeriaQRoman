import { useCallback, useRef, useState } from "react";
import { useDebounced } from "./useDebounced";

enum UpdateSource {
  STATE1 = 1,
  STATE2 = 2,
}

type BidirectionalStateProps<T1, T2> = {
  initialState1: T1;
  fetchState1: (newState2: T2, oldState1: T1) => Promise<T1>;
  debounceFetchState1?: number;
  initialState2: T2;
  fetchState2: (newState1: T1, oldState2: T2) => Promise<T2>;
  debounceFetchState2?: number;
};

export function useBidirectionalStateUpdates<T1, T2>({
  initialState1,
  fetchState1,
  debounceFetchState1 = 0,
  fetchState2,
  initialState2,
  debounceFetchState2 = 0,
}: BidirectionalStateProps<T1, T2>) {
  const [state1, setState1] = useState(initialState1);
  const [state2, setState2] = useState(initialState2);
  const debouncedFetchState1 = useDebounced(fetchState1, debounceFetchState1);
  const debouncedFetchState2 = useDebounced(fetchState2, debounceFetchState2);

  const updateSource = useRef(UpdateSource.STATE1);
  const updateVersion = useRef(0);

  const updateState1 = useCallback(
    (newState1: T1) => {
      const version = ++updateVersion.current;
      updateSource.current = UpdateSource.STATE1;
      setState1(newState1);
      debouncedFetchState2.delayedExecute(newState1, state2).then((newState2) => {
        if (updateSource.current !== UpdateSource.STATE1 || updateVersion.current !== version) return;
        setState2(newState2);
      });
    },
    [state2, debouncedFetchState2]
  );

  const updateState2 = useCallback(
    (newState2: T2) => {
      const version = ++updateVersion.current;
      updateSource.current = UpdateSource.STATE2;
      setState2(newState2);
      debouncedFetchState1.delayedExecute(newState2, state1).then((newState1) => {
        if (updateSource.current !== UpdateSource.STATE2 || updateVersion.current !== version) return;
        setState1(newState1);
      });
    },
    [state1, debouncedFetchState1]
  );

  return {
    state1,
    updateState1,
    fetchingState1: debouncedFetchState1.executing,
    state2,
    updateState2,
    fetchingState2: debouncedFetchState2.executing,
  };
}
