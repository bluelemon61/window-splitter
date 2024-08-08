"use client";

import { useEffect } from "react";
import useSplitInfo from "./hooks/useSplitInfo";
import { UseSplitInfo } from "./types/UseSplitInfo";
import { BoxWindowObject } from "./types/BoxWindowObject";

export default function Navigator() {
  const [splitInfo, setSplitInfo]: UseSplitInfo =
    useSplitInfo("WINDOW-SPLITER");

  const windowAdder = (color: string) => {
    const boxWindowObject: BoxWindowObject = {
      color,
    };

    setSplitInfo({
      ...splitInfo,
      childs: [...splitInfo.childs, boxWindowObject],
    });
  };

  const windowClear = () => {
    setSplitInfo({
      isVertical: true,
      childs: [],
    });
  };

  return (
    <nav>
      <button
        className="p-2 bg-red-300"
        onClick={(e) => {
          windowAdder("red");
        }}
      >
        Red
      </button>
      <button
        className="p-2 bg-green-300"
        onClick={(e) => {
          windowAdder("green");
        }}
      >
        Green
      </button>
      <button
        className="p-2 bg-blue-300"
        onClick={(e) => {
          windowAdder("blue");
        }}
      >
        Blue
      </button>
      <button
        className="p-2 bg-gray-300"
        onClick={(e) => {
          windowClear();
        }}
      >
        Clear
      </button>
    </nav>
  );
}
