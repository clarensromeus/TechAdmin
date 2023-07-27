import { useEffect, useState } from 'react';
import __ from 'lodash';

function useDebounce<T>(value: T, delayTime?: number): T {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    // Update debounced value after delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delayTime || 300);
    // Cancel the timeout if value changes (also on delay change or unmount)
    // This is how we prevent debounced value from updating if value is changed ...
    // .. within the delay period. Timeout gets cleared and restarted.
    return () => {
      clearTimeout(handler);
    };
  }, [value, delayTime]);
  return debouncedValue;
}

export default useDebounce;

// lodash is a perfect library providing many well-crafted features we can use as developper so
// debounce is one of lodash features according to your preference you can use it instead
