import { Fragment } from "react";
import { Splitter } from "../types/Slplitter";
import BoxWindow from "./BoxWindow";
import useLocalStorage from "../hooks/useLocalStorage";

export default function SpliterWindow({
  isVertical = false,
  childs = [],
  address,
}: Splitter) {
  const wsize = 100;

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
    >
      {
        childs.map((box, index) => {
          if (isSplitter(box)) {
            return (
              <Fragment key={index}>
                {
                  // 각 window 사이의 구분 선
                  index > 0 && <div className="border-2 border-white" />
                }
                <SpliterWindow isVertical={box.isVertical} childs={box.childs} address={`${box.address}`}/>
              </Fragment>
            );
          } else {
            return (
              <Fragment key={index}>
                {
                  // 각 window 사이의 구분 선
                  index > 0 && <div className="border-2 border-white" />
                }
                <BoxWindow childs={box.childs} scale={1} address={`${box.address}`} selected={box.selected}/>
              </Fragment>
            );
          }
        })
      }
    </div>
  )
}
