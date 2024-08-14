import { Fragment, useEffect, useRef, useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import { BoxWindowObject } from "../types/BoxWindowObject";
import useSplitInfo from "../hooks/useSplitInfo";
import { Splitter } from "../types/Slplitter";
import crypto from "crypto";
import boxList from "../boxes/boxList";
import { BoxObject } from "../types/BoxObject";

export default function BoxWindow({ childs, scale, address, selected, fold}: BoxWindowObject) {
  const windowSize = Math.min(Math.ceil(scale * 100), 100);

  const boxRef = useRef<HTMLDivElement | null>(null);
  const tabRef = useRef<HTMLDivElement | null>(null);

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [positioning, setPositioning] = useState("none");
  const [dragTabIndex, setDragTabIndex] = useState(-1);
  const [isParentVertical, setIsParentVertical] = useState(true);
  
  const [windowSelect, setWindowSelect] = useLocalStorage<string>("WINDOW-SPLITTER-SELECT");
  const [isDragging, setIsDragging] = useLocalStorage<boolean>("WINDOW-SPLITTER-DRAG");
  const [draggedObject, setDraggedObject] = useLocalStorage<string>("WINDOW-SPLITTER-DRAGGED-OBJECT");
  const [fullscreenAddress, setFullScreenAddress] = useLocalStorage<string>("WINDOW-SPLITTER-FULLSCREEN");
  const [splitInfo, setSplitInfo] = useSplitInfo("WINDOW-SPLITTER");

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
    const getParentDirection = () => {
      let isVertical = true;

      const recursiveFinder = (data: Splitter | BoxWindowObject) => {
        if ('isVertical' in data) {
          data.childs.forEach((child) => {
            if (child.address === address) {
              isVertical = data.isVertical;
            }
            recursiveFinder(child);
          });
        }
      }

      recursiveFinder(splitInfo);

      return isVertical;
    }

    setIsParentVertical(getParentDirection());
  }, [splitInfo]);

  useEffect(() => {
    const windowPositioner = () => {
      let newPositioning = "none";

      if (
        0 <= mousePosition.x && mousePosition.x <= 100 &&
        0 <= mousePosition.y && mousePosition.y <= 100
      ) {
        if (mousePosition.y < 20) {
          newPositioning = "top";
        } else if (mousePosition.y > 80) {
          newPositioning = "bottom";
        } else {
          if (mousePosition.x < 25) {
            newPositioning = "left";
          } else if (mousePosition.x > 75) {
            newPositioning = "right";
          } else {
            newPositioning = "middle";
          }
        }
      }

      if (newPositioning !== positioning) {
        setPositioning(newPositioning);
      }
    };

    windowPositioner();
  }, [mousePosition, positioning]);

  const newSpliterMaker = (data: Splitter | BoxWindowObject, address: string): BoxWindowObject | Splitter => {
    if ('isVertical' in data) { // Splitter일 경우
      const newWindow: BoxWindowObject = {
        scale: 1,
        address: crypto.createHash('sha256').update((new Date()).toISOString()+address).digest('base64'),
        childs: [{
          name: windowSelect,
          address: crypto.createHash('sha256').update((new Date()).toISOString()+windowSelect).digest('base64'),
        }],
        selected: 0,
        fold: false,
      }; 
      let addIdx = -1;

      const newChilds = data.childs.map((child, index) => {
        if (child.address === address) {
          switch(positioning) {
            case 'left':
              if (data.isVertical) {
                return {
                  isVertical: false,
                  childs: [{...newWindow, scale: 1/2}, {...child, scale: 1/2}],
                  address: crypto.createHash('sha256').update((new Date()).toISOString()).digest('base64'),
                } as Splitter;
              } else {
                addIdx = index;
                return child;
              }
            case 'right':
              if (data.isVertical) {
                return {
                  isVertical: false,
                  childs: [{...child, scale: 1/2}, {...newWindow, scale: 1/2}],
                  address: crypto.createHash('sha256').update((new Date()).toISOString()).digest('base64'),
                } as Splitter;
              } else {
                addIdx = index+1;
                return child;
              }
            case 'top':
              if (!data.isVertical) {
                return {
                  isVertical: true,
                  childs: [{...newWindow, scale: 1/2}, {...child, scale: 1/2}],
                  address: crypto.createHash('sha256').update((new Date()).toISOString()).digest('base64'),
                } as Splitter;
              } else {
                addIdx = index;
                return child;
              }
            case 'bottom':
              if (!data.isVertical) {
                return {
                  isVertical: true,
                  childs: [{...child, scale: 1/2}, {...newWindow, scale: 1/2}],
                  address: crypto.createHash('sha256').update((new Date()).toISOString()).digest('base64'),
                } as Splitter;
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
                selected: child.childs.length,
              } as BoxWindowObject
            case 'none':
              if (!('isVertical' in child)) {
                const newTab: BoxObject = {
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
                  selected: dragTabIndex > -1 ? dragTabIndex : child.selected,
                } as BoxWindowObject;
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

      let unfoldCount = 0;
      newChilds.forEach((child) => {
        unfoldCount++;
        if ('fold' in child && child.fold) unfoldCount--;
      })

      return {
        ...data,
        childs: newChilds.map((child) => {
          return {
            ...child,
            scale: unfoldCount > 0 ? 1/unfoldCount : 1,
          }
        }),
      }
    } else {
      return data
    }
  }

  const windowAdderListener = (e: React.MouseEvent<HTMLDivElement, MouseEvent> | React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (windowSelect) {
      setDraggedObject(null);
      setWindowSelect(null);
      setIsDragging(false);

      // 새로운 Window 추가
      const newSplitInfo = newSpliterMaker(splitInfo, address);
      // 만약 새로운 Window 추가가 아닌 기존 Window의 위치 이동(drag)이라면 변경 전 Window 정보를 삭제한다.
      const newSplitInfoDeleted = 
        draggedObject && (dragTabIndex > -1 || positioning !== 'none')
          ? deleteSpliterMaker(newSplitInfo, draggedObject) : newSplitInfo;
      setSplitInfo(newSplitInfoDeleted as Splitter);
    }
  }

  const deleteSpliterMaker = (data: Splitter | BoxWindowObject, address: string): Splitter | BoxWindowObject => {
    if ('isVertical' in data) {
      let unfoldCount = 0;
      const newChilds = data.childs.map((child) => deleteSpliterMaker(child, address))
                                    .filter((child) => child.childs.length)
                                    .map((child) => {
                                      if ('isVertical' in child && child.childs.length === 1) {
                                        return child.childs[0];
                                      }
                                      else return child;
                                    })
      
      newChilds.forEach((child) => {
        unfoldCount++;
        if ('fold' in child && child.fold) unfoldCount--;
      })

      return {
        ...data,
        childs: newChilds.map((child) => {
          return {
            ...child,
            scale: unfoldCount > 0 ? 1/unfoldCount : 1,
          }
        }),
      } as Splitter;
    } else {
      const isOverflow = data.selected < data.childs.length - 1 ? false : true;
      let newSelected = data.selected;

      const newChilds = data.childs.filter((child, index) => {
        if (child.address === address && isOverflow) newSelected -= 1;
        return child.address !== address
      });

      if (newChilds.length === 0) setFullScreenAddress(null);

      return {
        ...data,
        childs: newChilds,
        selected: newSelected,
      } as BoxWindowObject;
    }
  }

  const windowDeleterListener = (e: React.MouseEvent<HTMLDivElement, MouseEvent> | React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (childs.length > selected) {
      setWindowSelect(null);
      setIsDragging(false);
      setSplitInfo(deleteSpliterMaker(splitInfo, childs[selected].address) as Splitter);
    }
  }

  const setSelected = (index: number) => {
    const selectTabMaker = (data: Splitter | BoxWindowObject, index: number): Splitter | BoxWindowObject => {
      if ('isVertical' in data) {
        return {
          ...data,
          childs: data.childs.map((child) => selectTabMaker(child, index)),
        };
      } else {
        if (data.address === address) {
          return {
            ...data,
            selected: index,
          };
        } else {
          return data;
        }
      }
    }

    setSplitInfo(selectTabMaker(splitInfo, index) as Splitter);
  }

  const mouseDownHandler = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, boxObject: BoxObject, index: number) => {
    if (splitInfo.childs.length) {
      setDragTabIndex(index);
      setIsDragging(true);
      setWindowSelect(boxObject.name);
      setDraggedObject(boxObject.address)
    }
  }

  const foldHandler = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const foldMaker = (data: Splitter | BoxWindowObject): Splitter | BoxWindowObject => {
      if ('isVertical' in data) {
        let unfoldCount = 0;
        return {
          ...data,
          childs: data.childs.map((child) => {
            const newChild = foldMaker(child);
            unfoldCount++;
            if ('fold' in newChild && newChild.fold) unfoldCount--;
            return newChild
          }).map((child) => {
            return {
              ...child,
              scale: unfoldCount > 0 ? 1/unfoldCount : 1,
            }
          })
        }
      } else {
        if (data.address === address) {
          return {
            ...data,
            fold: !data.fold,
          }
        } else {
          return data;
        }
      }
    }

    setSplitInfo(foldMaker(splitInfo) as Splitter);
  }

  const fullscreenHandler = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (fullscreenAddress) {
      setFullScreenAddress(null);
    } else {
      setFullScreenAddress(address);
    }
    
  }

  return (
    <div
      className={
        `flex
        ${
          isParentVertical
          ? fold ? 'flex-col' : 'h-full flex-col'
          : fold ? 'flex-row' : 'flex-col'
        }`
      }
      style={{
        flexBasis: !fold ? `${windowSize}%` : undefined,
      }}
      onMouseUp={windowAdderListener}
    >
      <div 
        className={
          `bg-black text-white flex 
          ${!isParentVertical && fold ? 'flex-col px-1' : 'py-1'}
          ${fold ? 'rounded-md' : 'rounded-t-md'}`
        }
        ref={tabRef}
      >
        {
          childs.map((child, index) => {
            return (
              <Fragment key={index}>
                {
                  // 각 Tab 사이의 구분 선
                  <div 
                    className={`border-2 m-0.5
                      ${dragTabIndex === index && isDragging 
                          ? 'border-blue-400'
                          : index === 0 
                            ? 'border-black' 
                            : 'border-gray-600'
                      }`}
                    onMouseOver={(e) => {
                      if (isDragging) setDragTabIndex(index);
                    }}
                  />
                }
                <button
                  className={
                    `${!isParentVertical && fold ? 'py-1': 'px-1'} rounded
                    ${selected === index ? 'bg-gray-400' : ''} hover:bg-gray-600`
                  }
                  style={{
                    writingMode: !isParentVertical && fold ? 'vertical-lr' : 'initial'
                  }}
                  onClick={(e) => setSelected(index)}
                  onMouseOver={(e) => {
                    if (isDragging) setDragTabIndex(index);
                  }}
                  onMouseDown={(e) => mouseDownHandler(e, child, index)}
                >
                  {child.name}
                </button>
              </Fragment>
            )
          })
        }
        {/* 드래그 용 Hidden Block */}
        <div
          className={`border-2 border-black m-0.5
            ${dragTabIndex === childs.length && isDragging ? 'border-blue-400': ''}`}
          onMouseOver={(e) => {
            if (isDragging) setDragTabIndex(childs.length);
          }}
        />
        <div
          className={`black ${!isParentVertical && fold ? 'h-full': 'w-full'}`}
          onMouseOver={(e) => {
            if (isDragging) setDragTabIndex(childs.length);
          }}
        />
        <button 
          className={
            `bg-black rounded-md text-white px-2 hover:bg-gray-600
            ${!isParentVertical && fold ? 'mb-1': 'mr-1'}`
          }
          onClick={fullscreenHandler}
        >
          {
            fullscreenAddress ? '▣' : '▢'
          }
        </button>
        <button 
          className={
            `bg-black rounded-md text-white px-2 hover:bg-gray-600
            ${!isParentVertical && fold ? 'mb-1': 'mr-1'}
            ${fullscreenAddress ? 'hidden' : ''}`
          }
          onClick={foldHandler}
        >
          { 
            isParentVertical 
              ? fold ? '∨' : '∧'
              : fold ? '>' : '<' 
          }
        </button>
      </div>
      <div 
        className={`relative h-full ${fold ? 'hidden' : ''}`}
        ref={boxRef}
      >
        {
          windowSelect
          ? <div
              className="absolute w-full h-full bg-white/50 border-2 rounded opacity-0 border-white hover:opacity-100"
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
            >
              {/* Positioning: {positioning},{" "}
              Mouse Position: {mousePosition.x}%,{mousePosition.y}% */}
            </div>
          : undefined
        }
        <div
          className={`flex flex-col justify-center items-center w-full h-full rounded-b-md`}
        >
          {
            childs.length > selected && selected > -1
            ? boxList[childs[selected].name ?? 'error']()
            : boxList['error']()
          }
          <button
            className="absolute top-1 right-1 bg-black rounded-md text-white px-2 opacity-30 hover:opacity-100"
            onClick={windowDeleterListener}
          >
            X
          </button>
        </div>
      </div>
    </div>
  );
}
