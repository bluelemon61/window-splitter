import { useEffect, useState } from "react";
import { Splitter } from "../types/Slplitter";
import { UseSplitInfo } from "../types/UseSplitInfo";

declare global {
  interface WindowEventMap {
    "local-storage": CustomEvent;
  }
}

const useSplitInfo = (key: string): UseSplitInfo => {
  const initSplitter: Splitter = {
    isVertical: true,
    childs: [],
  };

  const [localStorageData, setLocalStorageData] =
    useState<Splitter>(initSplitter);

  useEffect(() => {
    try {
      const item = localStorage.getItem(key);
      if (item) {
        setLocalStorageData(JSON.parse(item));
      } else {
        localStorage.setItem(key, JSON.stringify(initSplitter));
      }
    } catch (error) {
      console.error(error);
    }
  }, [key]);

  const setSplitInfo = (value: Splitter) => {
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
    console.log(event);
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
      localStorage.setItem(key, JSON.stringify(initSplitter));
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

  return [localStorageData, setSplitInfo];
};

export default useSplitInfo;
