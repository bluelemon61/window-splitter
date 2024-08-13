"use client";

import { UseSplitInfo } from "./types/UseSplitInfo";
import useSplitInfo from "./hooks/useSplitInfo";
import SpliterWindow from "./components/SpliterWindow";
import useLocalStorage from "./hooks/useLocalStorage";

export default function Home() {
  const [splitInfo, setSplitInfo]: UseSplitInfo = useSplitInfo("WINDOW-SPLITTER");
  const [windowSelect, setWindowSelect] = useLocalStorage<string>("WINDOW-SPLITTER-SELECT");
  const [isDragging, setIsDragging] = useLocalStorage<boolean>("WINDOW-SPLITTER-DRAG");
  const [draggedObject, setDraggedObject] = useLocalStorage<string>("WINDOW-SPLITTER-DRAGGED-OBJECT");

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
        <SpliterWindow
          isVertical={splitInfo.isVertical}
          childs={splitInfo.childs}
          address={splitInfo.address}
        />
      }
    </main>
  );
}
