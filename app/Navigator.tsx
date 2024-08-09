"use client";

import useSplitInfo from "./hooks/useSplitInfo";
import { BoxWindowObject } from "./types/BoxWindowObject";
import useSelect from "./hooks/useSelect";
import crypto from "crypto";

export default function Navigator() {
  const [splitInfo, setSplitInfo] = useSplitInfo("WINDOW-SPLITER");
  const [windowSelect, setWindowSelect] = useSelect("WINDOW-SPLITTER-SELECT");

  const windowAdder = (color: string) => {
    const boxWindowObject: BoxWindowObject = {
      address: crypto.createHash('sha256').update((new Date()).toISOString()).digest('base64'),
      childs:[{
        name: color,
        address: crypto.createHash('sha256').update((new Date()).toISOString()+color).digest('base64'),
      }]
    };

    setSplitInfo({
      ...splitInfo,
      childs: [...splitInfo.childs, boxWindowObject],
    });
  };

  const windowClear = () => {
    setSplitInfo({
      isVertical: false,
      childs: [],
      address: crypto.createHash('sha256').update((new Date()).toISOString()).digest('base64'),
    });
  };

  const windowSelector = (color: string) => {
    if (splitInfo.childs.length) {
      if (windowSelect === color) setWindowSelect(null);
      else setWindowSelect(color);
    } else {
      windowAdder(color);
    }
  }

  return (
    <nav>
      <button
        className={`p-2 bg-red-300 ${windowSelect === 'red' ? 'font-black' : ''}`}
        onClick={(e) => {
          windowSelector("red");
        }}
      >
        Red
      </button>
      <button
        className={`p-2 bg-green-300 ${windowSelect === 'green' ? 'font-black' : ''}`}
        onClick={(e) => {
          windowSelector("green");
        }}
      >
        Green
      </button>
      <button
        className={`p-2 bg-blue-300 ${windowSelect === 'blue' ? 'font-black' : ''}`}
        onClick={(e) => {
          windowSelector("blue");
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
