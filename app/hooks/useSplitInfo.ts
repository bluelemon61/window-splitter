import { useState, useEffect } from "react";
import { Splitter } from "../types/Slplitter";

const useSplitInfo = (key: string) => {
  const [localStorageData, setLocalStorageData] = useState<Splitter | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(error);
      return null;
    }
  });

  const setSplitInfo = (value: Splitter) => {
    try {
      setLocalStorageData(value);
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(error);
    }
  }

  return [ localStorageData, setSplitInfo ];
};

export default useSplitInfo;