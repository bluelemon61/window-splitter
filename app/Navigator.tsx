"use client";

import useSplitInfo from "./hooks/useSplitInfo";
import { BoxWindowObject } from "./types/BoxWindowObject";
import useLocalStorage from "./hooks/useLocalStorage";
import crypto from "crypto";

export default function Navigator() {
  const [splitInfo, setSplitInfo] = useSplitInfo("WINDOW-SPLITTER");
  const [windowSelect, setWindowSelect] = useLocalStorage<string>("WINDOW-SPLITTER-SELECT");
  const [isDragging, setIsDragging] = useLocalStorage<boolean>("WINDOW-SPLITTER-DRAG");
  const [draggedObject, setDraggedObject] = useLocalStorage<string>("WINDOW-SPLITTER-DRAGGED-OBJECT");

  const windowAdder = (color: string) => {
    const boxWindowObject: BoxWindowObject = {
      address: crypto.createHash('sha256').update((new Date()).toISOString()).digest('base64'),
      childs:[{
        name: color,
        address: crypto.createHash('sha256').update((new Date()).toISOString()+color).digest('base64'),
      }],
      selected: 0,
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
    if (windowSelect === color) {
      setWindowSelect(null);
    }

    if (splitInfo.childs.length) {
      setWindowSelect(color);
    } else {
      windowAdder(color);
    }
  }

  const mouseDownHandler = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, name: string) => {
    if (splitInfo.childs.length) {
      setIsDragging(true);
      setWindowSelect(name);
    }
  }

  return (
    <nav
      onMouseUp={(e) => {
        setWindowSelect(null);
        setIsDragging(false);
        setDraggedObject(null);
      }}
    >
      <button
        className={`p-2 bg-red-300 ${windowSelect === 'red' ? 'font-black' : ''}`}
        onClick={(e) => windowSelector("red")}
        onMouseDown={(e) => mouseDownHandler(e, "red")}
      >
        Red
      </button>
      <button
        className={`p-2 bg-green-300 ${windowSelect === 'green' ? 'font-black' : ''}`}
        onClick={(e) => windowSelector("green")}
        onMouseDown={(e) => mouseDownHandler(e, "green")}
      >
        Green
      </button>
      <button
        className={`p-2 bg-blue-300 ${windowSelect === 'blue' ? 'font-black' : ''}`}
        onClick={(e) => windowSelector("blue")}
        onMouseDown={(e) => mouseDownHandler(e, "blue")}
      >
        Blue
      </button>
      <button
        className="p-2 bg-gray-300"
        onClick={(e) => windowClear()}
      >
        Clear
      </button>
    </nav>
  );
}
