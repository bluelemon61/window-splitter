import { useState, useEffect } from "react";

const KEY = "WINDOW_SPLITTER";

const useSplitInfo = () => {
  const [localStorageData, setLocalStorageData] = useState(
    localStorage.getItem(KEY)
  );

  useEffect(() => {
    const handleStorageChange = () => {
      setLocalStorageData(localStorage.getItem(KEY));
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return [ localStorageData, setLocalStorageData ];
};

export default useSplitInfo;