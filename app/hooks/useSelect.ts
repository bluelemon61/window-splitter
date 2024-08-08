import { useEffect, useState } from "react";
import { UseSelect } from "../types/UseSelect";

declare global {
  interface WindowEventMap {
    "local-storage": CustomEvent;
  }
}

const useSelect = (key: string): UseSelect => {
  const initSelect: string | null = null;

  const [localStorageData, setLocalStorageData] = useState<string | null>(initSelect);

  useEffect(() => {
    try {
      const item = localStorage.getItem(key);
      if (item) {
        setLocalStorageData(JSON.parse(item));
      } else {
        localStorage.setItem(key, JSON.stringify(initSelect));
      }
    } catch (error) {
      console.error(error);
    }
  }, [key]);

  const setSelect = (value: string | null) => {
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
      localStorage.setItem(key, JSON.stringify(initSelect));
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

  return [localStorageData, setSelect];
};

export default useSelect;
