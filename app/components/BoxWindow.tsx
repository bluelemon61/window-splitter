import { useEffect, useRef, useState } from "react";
import useSelect from "../hooks/useSelect";
import { BoxWindowObject } from "../types/BoxWindowObject";
import useSplitInfo from "../hooks/useSplitInfo";
import { Splitter } from "../types/Slplitter";
import crypto from "crypto";
import boxList from "../boxes/boxList";
import { BoxObject } from "../types/BoxObject";

export default function BoxWindow({ childs, scale = 1 , address}: BoxWindowObject) {
  const wsize = Math.min(Math.ceil(scale * 100), 100);
  const boxRef = useRef<HTMLDivElement | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [positioning, setPositioning] = useState("none");
  const [windowSelect, setWindowSelect] = useSelect("WINDOW-SPLITTER-SELECT");
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

  const newSpliterMaker = (data: BoxWindowObject | Splitter, address: string): BoxWindowObject | Splitter => {
    if ('isVertical' in data) {
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
          console.log(address);
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
            default:
              return child;
          }
        }
        return newSpliterMaker(child, address)
      });

      console.log(addIdx, newChilds);

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

  const windowAdderListener = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (windowSelect) {
      setWindowSelect(null);

      setSplitInfo(newSpliterMaker(splitInfo, address) as Splitter);
    }
  }

  const [selectedTab, setSelectedTab] = useState<number>(0);

  return (
    <div
      className="flex flex-col h-full"
      style={{
        width: `${wsize}%`,
      }}
    >
      <div className="bg-black text-white">
        {
          childs.map((child, index) => {
            return (
              <button
                key={index}
                className={`p-1 rounded ${selectedTab === index ? 'bg-gray-400' : ''}`}
                onClick={(e) => setSelectedTab(index)}
              >
                {child.name}
              </button>
            )
          })
        }
      </div>
      <div className={`relative h-full`} ref={boxRef}>
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
              onClick={windowAdderListener}
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
