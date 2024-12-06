import { useEffect } from "react";

const useDebounce = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: string,
  callback: (debounceValue?: string) => void,
  delay: number
) => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      callback(value);
    }, delay);
    return () => clearTimeout(timeout);
  }, [callback, value, delay]);
};
export default useDebounce;
