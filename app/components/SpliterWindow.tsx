import { Fragment, useEffect, useRef, useState } from "react";
import { Splitter } from "../types/Slplitter";
import BoxWindow from "./BoxWindow";
import useLocalStorage from "../hooks/useLocalStorage";
import useSplitInfo from "../hooks/useSplitInfo";
import { BoxWindowObject } from "../types/BoxWindowObject";

export default function SpliterWindow({
  scale,
  isVertical,
  childs = [],
  address,
}: Splitter) {
  const windowSize = Math.min(Math.ceil(scale * 100), 100);
  const barSize = 12;

  const boxRef = useRef<HTMLDivElement | null>(null);

  const [windowSelect, setWindowSelect] = useLocalStorage<string>("WINDOW-SPLITTER-SELECT");
  const [isDragging, setIsDragging] = useLocalStorage<boolean>("WINDOW-SPLITTER-DRAG");
  const [draggedObject, setDraggedObject] = useLocalStorage<string>("WINDOW-SPLITTER-DRAGGED-OBJECT");
  const [splitInfo, setSplitInfo] = useSplitInfo("WINDOW-SPLITTER");

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [rectSize, setRectSize] = useState({ x: 0, y: 0 })
  const [dragRect, setDragRect] = useState({ start: 0, end: 0})
  const [splitbarDragging, setSplitbarDragging] = useState<number>(-1);

  function isSplitter(box: any): box is Splitter {
    return (box as Splitter).isVertical !== undefined;
  }

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (boxRef.current) {
        const rect = boxRef.current.getBoundingClientRect();
        
        setRectSize({
          x: rect.width,
          y: rect.height,
        })

        const relativeX = event.clientX - rect.left;
        const relativeY = event.clientY - rect.top;

        setMousePosition({
          x: relativeX,
          y: relativeY,
        });
      }
    };

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    if (splitbarDragging > -1) {
      let startPoint = 0;
      let endPoint = 0;

      const multiplier = (isVertical ? rectSize.y : rectSize.x) - (barSize * (childs.length-1));

      for (let i = 0; i <= splitbarDragging; i++) {
        endPoint += childs[i].scale * multiplier + barSize;
        if (i > 1) {
          startPoint += childs[i-2].scale * multiplier + barSize;
        }
      }

      endPoint -= barSize;

      setDragRect({
        start: startPoint,
        end: endPoint,
      })
    }
  }, [splitbarDragging])

  const scaleHandler = () => {
    if (splitbarDragging > -1) {
      const childsScale = childs.map((child) => child.scale);
      const scaleMultiplier = childsScale[splitbarDragging-1]+childsScale[splitbarDragging];

      const position = isVertical ? mousePosition.y : mousePosition.x;

      const firstPx = position - dragRect.start - barSize/2;
      const secondPx = dragRect.end - (position + barSize/2);

      childsScale[splitbarDragging-1] = (firstPx / (firstPx + secondPx)) * scaleMultiplier;
      childsScale[splitbarDragging] = (secondPx / (firstPx + secondPx)) * scaleMultiplier;

      console.log(childsScale);

      const scaleMaker = (data: Splitter | BoxWindowObject): Splitter | BoxWindowObject => {
        if ('isVertical' in data) {
          if (data.address === address) {
            return {
              ...data,
              childs: data.childs.map((child, index) => {
                return {
                  ...child,
                  scale: childsScale[index],
                };
              }),
            };
          } else {
            return {
              ...data,
              childs: data.childs.map((child) => scaleMaker(child)),
            };
          }
        } else {
          return data;
        }
      };

      const newSplitInfo = scaleMaker(splitInfo);
      setSplitbarDragging(-1);
      setSplitInfo(newSplitInfo as Splitter);
    }
  }

  return (
    <div 
      className={`relative flex w-full h-full items-stretch justify-stretch ${isVertical ? 'flex-col' : ''}`}
      onMouseUp={(e) => {
        setWindowSelect(null);
        setIsDragging(false);
        setDraggedObject(null);
        scaleHandler();
        setSplitbarDragging(-1);
      }}
      style={{
        flexBasis: `${windowSize}%`,
      }}
      ref={boxRef}
    >
      {
        splitbarDragging > -1
        ? <div 
            className={`absolute flex ${isVertical ? 'flex-col' : ''} w-full h-full z-10`}
          >
            <div
              className={`absolute rounded-md  border-white bg-black/50`}
              style={{
                left: !isVertical ? dragRect.start : '',
                top: isVertical ? dragRect.start : '',
                width: !isVertical ? mousePosition.x - dragRect.start - barSize/2 : '100%',
                height: isVertical ? mousePosition.y - dragRect.start - barSize/2 : '100%',
              }}
            />
            <div
              className={`absolute ${isVertical ? 'w-full' : 'h-full'} border-2 border-blue-400`}
              style={{
                left: isVertical ? '' : `${mousePosition.x - 2}px`,
                top: !isVertical ? '' : `${mousePosition.y - 2}px`,
              }}
            />
            <div
              className={`absolute rounded-md  border-white bg-black/50`}
              style={{
                left: !isVertical ? `${mousePosition.x + barSize/2}px` : '',
                top: isVertical ? `${mousePosition.y + barSize/2}px` : '',
                width: !isVertical ? dragRect.end - (mousePosition.x + barSize/2) : '100%',
                height: isVertical ? dragRect.end - (mousePosition.y + barSize/2) : '100%',
              }}
            />
          </div>
        : undefined
      }
      {
        childs.map((box, index) => {
          return (
            <Fragment key={index}>
              {
                // 각 window 사이의 구분 선
                index > 0 && 
                  <div 
                    className={`flex ${isVertical ? 'flex-col w-full my-1' : 'h-full mx-1'} hover:bg-blue-400`}
                    onMouseDown={(e) => {
                      setSplitbarDragging(index);
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
