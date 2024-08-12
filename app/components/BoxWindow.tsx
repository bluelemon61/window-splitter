import { Fragment, useEffect, useRef, useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import { BoxWindowObject } from "../types/BoxWindowObject";
import useSplitInfo from "../hooks/useSplitInfo";
import { Splitter } from "../types/Slplitter";
import crypto from "crypto";
import boxList from "../boxes/boxList";
import { BoxObject } from "../types/BoxObject";

export default function BoxWindow({ childs, scale = 1 , address}: BoxWindowObject) {
  const wsize = Math.min(Math.ceil(scale * 100), 100);
  const boxRef = useRef<HTMLDivElement | null>(null);
  const tabRef = useRef<HTMLDivElement | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [positioning, setPositioning] = useState("none");
  const [dragTabIndex, setDragTabIndex] = useState(-1);
  const [windowSelect, setWindowSelect] = useLocalStorage<string>("WINDOW-SPLITTER-SELECT");
  const [isDragging, setIsDragging] = useLocalStorage<boolean>("WINDOW-SPLITER-DRAG");
  const [splitInfo, setSplitInfo] = useSplitInfo("WINDOW-SPLITER");

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (boxRef.current) {
        const rect = boxRef.current.getBoundingClientRect();
        const relativeX = event.clientX - rect.left;
        const relativeY = event.clientY - rect.top;

        const percentX = (relativeX / rect.width) * 100;
        const percentY = (relativeY / rect.height) * 100;

        setMousePosition({
          x: parseFloat(percentX.toFixed(2)),
          y: parseFloat(percentY.toFixed(2)),
        });
      }

      if (tabRef.current) {
        const rect = tabRef.current.getBoundingClientRect();
        const relativeX = event.clientX - rect.left;
        const relativeY = event.clientY - rect.top;

        const percentX = (relativeX / rect.width) * 100;
        const percentY = (relativeY / rect.height) * 100;

        if (percentX < 0 || 100 < percentX || percentY < 0 || 100 < percentY) {
          setDragTabIndex(-1);
        }
      }
    };

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const windowPositioner = () => {
      if (
        0 <= mousePosition.x && mousePosition.x <= 100 &&
        0 <= mousePosition.y && mousePosition.y <= 100
      ) {
        if (mousePosition.y < 20) {
          setPositioning("top");
        } else if (mousePosition.y > 80) {
          setPositioning("bottom");
        } else {
          if (mousePosition.x < 25) {
            setPositioning("left");
          } else if (mousePosition.x > 75) {
            setPositioning("right");
          } else {
            setPositioning("middle");
          }
        }
      } else {
        setPositioning("none");
      }
    };

    windowPositioner();
  }, [mousePosition]);

  const newSpliterMaker = (data: Splitter | BoxWindowObject, address: string): BoxWindowObject | Splitter => {
    if ('isVertical' in data) { // Splitter일 경우
      const newWindow: BoxWindowObject = {
        address: crypto.createHash('sha256').update((new Date()).toISOString()+address).digest('base64'),
        childs: [{
          name: windowSelect,
          address: crypto.createHash('sha256').update((new Date()).toISOString()+windowSelect).digest('base64'),
        }],
      }; 
      let addIdx = -1;

      const newChilds = data.childs.map((child, index) => {
        if (child.address === address) {
          switch(positioning) {
            case 'left':
              if (data.isVertical) {
                return {
                  isVertical: false,
                  childs: [newWindow, child],
                  address: crypto.createHash('sha256').update((new Date()).toISOString()).digest('base64'),
                };
              } else {
                addIdx = index;
                return child;
              }
            case 'right':
              if (data.isVertical) {
                return {
                  isVertical: false,
                  childs: [child, newWindow],
                  address: crypto.createHash('sha256').update((new Date()).toISOString()).digest('base64'),
                };
              } else {
                addIdx = index+1;
                return child;
              }
            case 'top':
              if (!data.isVertical) {
                return {
                  isVertical: true,
                  childs: [newWindow, child],
                  address: crypto.createHash('sha256').update((new Date()).toISOString()).digest('base64'),
                };
              } else {
                addIdx = index;
                return child;
              }
            case 'bottom':
              if (!data.isVertical) {
                return {
                  isVertical: true,
                  childs: [child, newWindow],
                  address: crypto.createHash('sha256').update((new Date()).toISOString()).digest('base64'),
                };
              } else {
                addIdx = index+1;
                return child;
              }
            case 'middle':
              return {
                ...child,
                childs: [
                  ...child.childs,
                  {
                    name: windowSelect,
                    address: crypto.createHash('sha256').update((new Date()).toISOString()).digest('base64'),
                  }
                ] as BoxObject[],
              } as BoxWindowObject
            case 'none':
              if (!('isVertical' in child)) {
                const newTab = {
                    name: windowSelect,
                    address: crypto.createHash('sha256').update((new Date()).toISOString()).digest('base64'),
                  }
              
                const newBoxChilds = child.childs

                if (dragTabIndex > -1) {
                  newBoxChilds.splice(dragTabIndex, 0, newTab);
                }

                return {
                  ...child,
                  childs: newBoxChilds,
                } as BoxWindowObject
              }
            default:
              return child;
          }
        }
        return newSpliterMaker(child, address)
      });

      if (addIdx > -1) {
        newChilds.splice(addIdx, 0, newWindow);
      }

      return {
        ...data,
        childs: newChilds,
      }
    } else {
      return data
    }
  }

  const windowAdderListener = (e: React.MouseEvent<HTMLDivElement, MouseEvent> | React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (windowSelect) {
      setWindowSelect(null);
      setIsDragging(false);
      setSplitInfo(newSpliterMaker(splitInfo, address) as Splitter);
    }
  }

  const [selectedTab, setSelectedTab] = useState<number>(0);

  return (
    <div
      className="flex flex-col h-full rounded-lg"
      style={{
        width: `${wsize}%`,
      }}
      onMouseUp={(e) => {
        setWindowSelect(null);
        setIsDragging(false);
      }}
    >
      <div 
        className="bg-black text-white flex py-1"
        ref={tabRef}
      >
        {
          childs.map((child, index) => {
            return (
              <Fragment key={index}>
                {
                  // 각 Tab 사이의 구분 선
                  <div className={`border-2 border-gray-600 m-0.5
                                  ${index === 0 ? 'border-black' : ''}
                                  ${dragTabIndex === index ? 'border-blue-400': ''}`} />
                }
                <button
                  className={`px-1 rounded ${selectedTab === index ? 'bg-gray-400' : ''}`}
                  onClick={(e) => setSelectedTab(index)}
                  onMouseOver={(e) => {
                    if (isDragging) setDragTabIndex(index);
                  }}
                  onMouseUp={windowAdderListener}
                >
                  {child.name}
                </button>
              </Fragment>
            )
          })
        }
        {/* 드래그 용 Hidden Block */}
        <div className={`border-2 border-black m-0.5
            ${dragTabIndex === childs.length ? 'border-blue-400': ''}`} />
        <div
          className={`black w-full`}
          onMouseOver={(e) => {
            if (isDragging) setDragTabIndex(childs.length);
          }}
          onMouseUp={windowAdderListener}
        />
      </div>
      <div 
        className={`relative h-full`}
        ref={boxRef}
      >
        {
          windowSelect
          ? <div
              className="absolute w-full h-full bg-white opacity-0 hover:opacity-50"
              style={
                positioning !== 'none' 
                ? {
                  width: positioning === 'left' || positioning === 'right' ? '50%' : undefined,
                  height: positioning === 'top' || positioning === 'bottom' ? '50%' : undefined,
                  right: positioning === 'right' ? 0 : undefined,
                  bottom: positioning === 'bottom' ? 0 : undefined,
                }
                : undefined
              }
              onMouseUp={windowAdderListener}
            >
              Positioning: {positioning},{" "}
              Mouse Position: {mousePosition.x}%,{mousePosition.y}%
            </div>
          : undefined
        }
        <div
          className={`flex flex-col justify-center items-center w-full h-full`}
        >
          {
            boxList[childs[selectedTab].name ?? 'error']()
          }
        </div>
      </div>
    </div>
  );
}
