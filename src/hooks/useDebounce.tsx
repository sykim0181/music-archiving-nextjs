import { useEffect, useState } from "react";

interface Props {
  value: string;
  delay: number;
}

const useDebounce = (props: Props) => {
  const { value, delay } = props;

  const [debouncedValue, setDebouncedValue] = useState<string>("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
