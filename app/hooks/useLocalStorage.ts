import { useEffect, useState } from "react";
import { UseLocalStorage } from "../types/UseLocalStorage";

declare global {
  interface WindowEventMap {
    "local-storage": CustomEvent;
  }
}

const useLocalStorage = <T>(key: string): UseLocalStorage => {
  const initValue: T | null = null;

  const [localStorageData, setLocalStorageData] = useState<T | null>(initValue);

  useEffect(() => {
    try {
      const item = localStorage.getItem(key);
      if (item) {
        setLocalStorageData(JSON.parse(item));
      } else {
        localStorage.setItem(key, JSON.stringify(initValue));
      }
    } catch (error) {
      console.error(error);
    }
  }, [key]);

  const setValue = (value: T | null) => {
    try {
      setLocalStorageData(value);
      localStorage.setItem(key, JSON.stringify(value));

      dispatchEvent(
        new CustomEvent(`local-storage`, {
          detail: {
            key,
          },
        }),
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleStorageChange = (event: CustomEvent | StorageEvent) => {
    if (
      event instanceof CustomEvent &&
      (event as CustomEvent).detail.key !== key
    ) {
      return;
    }
    if (event instanceof StorageEvent && event.key !== key) {
      return;
    }

    const item = localStorage.getItem(key);
    if (item) {
      setLocalStorageData(JSON.parse(item));
    } else {
      localStorage.setItem(key, JSON.stringify(initValue));
    }
  };

  useEffect(() => {
    addEventListener("storage", handleStorageChange); // 다른 탭
    addEventListener("local-storage", handleStorageChange); // 동일한 탭, 다른 컴포넌트

    return () => {
      removeEventListener("local-storage", handleStorageChange);
      removeEventListener("local-storage", handleStorageChange);
    };
  });

  return [localStorageData, setValue];
};

export default useLocalStorage;
