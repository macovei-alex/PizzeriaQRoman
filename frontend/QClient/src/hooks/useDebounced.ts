import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type TFunction = (...args: any[]) => Promise<any>;

export function useDebounced<T extends TFunction>(func: T, delay: number) {
  type TFunctionReturn = Awaited<ReturnType<T>>;

  const funcRef = useRef<T>(func);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [executing, setExecuting] = useState(false);
  const pendingPromiseRef = useRef<{
    resolve: (value: TFunctionReturn) => void;
    reject: (reason?: any) => void;
  } | null>(null);

  funcRef.current = func;

  const executeFunction = useCallback((...args: Parameters<T>) => {
    setExecuting(true);
    funcRef
      .current(...args)
      .then((res) => pendingPromiseRef.current?.resolve(res))
      .catch((err) => pendingPromiseRef.current?.reject(err))
      .finally(() => {
        setExecuting(false);
        pendingPromiseRef.current = null;
      });
  }, []);

  const delayedExecute = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        pendingPromiseRef.current?.reject(new Error("Debounced call cancelled"));
        pendingPromiseRef.current = null;
      }

      return new Promise<TFunctionReturn>((resolve, reject) => {
        pendingPromiseRef.current = { resolve, reject };

        if (delay <= 0) {
          executeFunction(...args);
        } else {
          timeoutRef.current = setTimeout(() => {
            timeoutRef.current = null;
            executeFunction(...args);
          }, delay);
        }
      });
    },
    [delay, executeFunction]
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (pendingPromiseRef.current) {
        pendingPromiseRef.current.reject(new Error("Component unmounted"));
        pendingPromiseRef.current = null;
      }
    };
  }, []);

  const debouncedObject = useMemo(
    () => ({
      delayedExecute,
      executing,
    }),
    [delayedExecute, executing]
  );

  return debouncedObject;
}
