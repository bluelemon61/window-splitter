"use client";

import { UseSplitInfo } from "./types/UseSplitInfo";
import useSplitInfo from "./hooks/useSplitInfo";
import SplitterWindow from "./components/SplitterWindow";
import useLocalStorage from "./hooks/useLocalStorage";
import BoxWindow from "./components/BoxWindow";
import { useEffect, useRef, useState } from "react";
import { BoxWindowObject } from "./types/BoxWindowObject";
import { Splitter } from "./types/Slplitter";
import VirtualWindow from "./VirtualWindow";
import boxList from "./boxes/boxList";

export default function Home() {
  const [splitInfo, setSplitInfo]: UseSplitInfo = useSplitInfo("WINDOW-SPLITTER");
  const [windowSelect, setWindowSelect] = useLocalStorage<string>("WINDOW-SPLITTER-SELECT");
  const [isDragging, setIsDragging] = useLocalStorage<boolean>("WINDOW-SPLITTER-DRAG");
  const [draggedObject, setDraggedObject] = useLocalStorage<string>("WINDOW-SPLITTER-DRAGGED-OBJECT");
  const [fullscreenAddress, setFullScreenAddress] = useLocalStorage<string>("WINDOW-SPLITTER-FULLSCREEN");
  const [fullscreenObject, setFullScreenObject] = useState<BoxWindowObject | undefined>(undefined);

  const boxRefs = Object.keys(boxList).reduce((acc, key) => {
    if (key === "error") return acc;
    acc[key] = useRef(null);
    return acc;
  }, {} as { [key: string]: React.RefObject<HTMLDivElement> });

  useEffect(() => {
    const objectFinder = (data: Splitter): BoxWindowObject | undefined => {
      let target: BoxWindowObject | undefined = undefined;

      data.childs.forEach((child) => {
        if (target === undefined) {
          if ("isVertical" in child) target = objectFinder(child);
          else target = fullscreenAddress === child.address ? child : undefined;
        }
      });

      return target;
    };

    if (fullscreenAddress) {
      const fullObj = objectFinder(splitInfo);
      setFullScreenObject(fullObj);
    } else {
      setFullScreenObject(undefined);
    }
  }, [fullscreenAddress, splitInfo]);
  return (
    <main
      id="window_splitter"
      className="flex items-stretch justify-stretch w-full h-full p-1"
      onMouseUp={(e) => {
        setWindowSelect(null);
        setIsDragging(false);
        setDraggedObject(null);
      }}
    >
      <VirtualWindow refs={boxRefs} />
      {fullscreenObject ? (
        <BoxWindow
          scale={1}
          fold={false}
          selected={fullscreenObject.selected}
          childs={fullscreenObject.childs}
          address={fullscreenObject.address}
          refs={boxRefs}
        />
      ) : (
        <SplitterWindow
          scale={splitInfo.scale}
          isVertical={splitInfo.isVertical}
          childs={splitInfo.childs}
          address={splitInfo.address}
          refs={boxRefs}
        />
      )}
    </main>
  );
}
