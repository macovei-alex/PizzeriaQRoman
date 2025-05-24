import { useCallback, useRef, useState } from "react";

type TFunction = (...args: any[]) => Promise<any>;

export function useDebounced<T extends TFunction>(func: T, delay: number) {
  type TFunctionReturn = Awaited<ReturnType<T>>;

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [executing, setExecuting] = useState(false);
  const pendingPromiseRef = useRef<{
    resolve: (value: TFunctionReturn) => void;
    reject: (reason?: any) => void;
  } | null>(null);

  const executeFunction = useCallback(
    (...args: Parameters<T>) => {
      setExecuting(true);
      func(...args)
        .then((res) => {
          if (pendingPromiseRef.current) {
            pendingPromiseRef.current.resolve(res);
            pendingPromiseRef.current = null;
          }
        })
        .catch((err) => {
          if (pendingPromiseRef.current) {
            pendingPromiseRef.current.reject(err);
            pendingPromiseRef.current = null;
          }
        })
        .finally(() => setExecuting(false));
    },
    [func]
  );

  const delayedExecute = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        if (pendingPromiseRef.current) {
          pendingPromiseRef.current.reject(new Error("Debounced call cancelled"));
          pendingPromiseRef.current = null;
        }
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

  return {
    delayedExecute,
    executing,
  };
}
