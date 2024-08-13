import { Fragment } from "react";
import { Splitter } from "../types/Slplitter";
import BoxWindow from "./BoxWindow";
import useLocalStorage from "../hooks/useLocalStorage";

export default function SpliterWindow({
  scale,
  isVertical,
  childs = [],
  address,
}: Splitter) {
  const windowSize = Math.min(Math.ceil(scale * 100), 100);

  const [windowSelect, setWindowSelect] = useLocalStorage<string>("WINDOW-SPLITTER-SELECT");
  const [isDragging, setIsDragging] = useLocalStorage<boolean>("WINDOW-SPLITTER-DRAG");
  const [draggedObject, setDraggedObject] = useLocalStorage<string>("WINDOW-SPLITTER-DRAGGED-OBJECT");

  function isSplitter(box: any): box is Splitter {
    return (box as Splitter).isVertical !== undefined;
  }

  return (
    <div 
      className={`flex w-full h-full items-stretch justify-stretch ${isVertical ? 'flex-col' : ''}`}
      onMouseUp={(e) => {
        setWindowSelect(null);
        setIsDragging(false);
        setDraggedObject(null);
      }}
      style={{
        flexBasis: `${windowSize}%`,
      }}
    >
      {
        childs.map((box, index) => {
          return (
            <Fragment key={index}>
              {
                // 각 window 사이의 구분 선
                index > 0 && 
                  <div 
                    className={`relative flex m-1 ${isVertical ? 'flex-col w-full' : 'h-full'} hover:bg-blue-400`}
                    onMouseDown={(e) => {

                    }}
                  >
                    <div className={`self-center border-2 border-gray-500 ${isVertical ? 'w-16' : 'h-16'}`}/>
                  </div>
              }
              {
                isSplitter(box)
                ? <SpliterWindow 
                    isVertical={box.isVertical}
                    scale={box.scale}
                    childs={box.childs}
                    address={`${box.address}`}
                  />
                : <BoxWindow 
                    childs={box.childs} 
                    scale={box.scale} 
                    address={box.address} 
                    selected={box.selected} 
                    fold={box.fold}
                  />
              }
            </Fragment>
          );
        })
      }
    </div>
  )
}
