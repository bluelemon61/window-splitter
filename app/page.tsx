"use client";

import { UseSplitInfo } from "./types/UseSplitInfo";
import useSplitInfo from "./hooks/useSplitInfo";
import SpliterWindow from "./components/SpliterWindow";
import useLocalStorage from "./hooks/useLocalStorage";
import BoxWindow from "./components/BoxWindow";
import { useEffect, useState } from "react";
import { BoxWindowObject } from "./types/BoxWindowObject";
import { Splitter } from "./types/Slplitter";

export default function Home() {
  const [splitInfo, setSplitInfo]: UseSplitInfo = useSplitInfo("WINDOW-SPLITTER");
  const [windowSelect, setWindowSelect] = useLocalStorage<string>("WINDOW-SPLITTER-SELECT");
  const [isDragging, setIsDragging] = useLocalStorage<boolean>("WINDOW-SPLITTER-DRAG");
  const [draggedObject, setDraggedObject] = useLocalStorage<string>("WINDOW-SPLITTER-DRAGGED-OBJECT");
  const [fullscreenAddress, setFullScreenAddress] = useLocalStorage<string>("WINDOW-SPLITTER-FULLSCREEN");4
  const [fullscreenObject, setFullScreenObject] = useState<BoxWindowObject | undefined>(undefined);

  useEffect(() => {
    const objectFinder = (data: Splitter): BoxWindowObject | undefined => {
      let target: BoxWindowObject | undefined = undefined;

      data.childs.forEach((child) => {
        if (target === undefined) {
          if ('isVertical' in child) target = objectFinder(child);
          else target = fullscreenAddress === child.address ? child : undefined;
        }
      })

      return target;
    };

    if (fullscreenAddress) {
      const fullObj = objectFinder(splitInfo)
      setFullScreenObject(fullObj);
    } else {
      setFullScreenObject(undefined);
    }
  }, [fullscreenAddress, splitInfo])
  return (
    <main 
      className="flex items-stretch justify-stretch w-full h-full p-1"
      onMouseUp={(e) => {
        setWindowSelect(null);
        setIsDragging(false);
        setDraggedObject(null);
      }}
    >
      {
        fullscreenObject
        ? <BoxWindow 
            fold={false}
            selected={fullscreenObject.selected}
            childs={fullscreenObject.childs}
            address={fullscreenObject.address}
          />
        : <SpliterWindow
            isVertical={splitInfo.isVertical}
            childs={splitInfo.childs}
            address={splitInfo.address}
          />
      }
    </main>
  );
}
