import { useEffect, useState } from "react";
import boxList from "./boxes/boxList";

export default function VirtualWindow({ refs }: { refs: { [key: string]: React.RefObject<HTMLDivElement> } }) {
  const [dimensions, setDimensions] = useState<{
    [x: string]: {
      width: number;
      height: number;
      top: number;
      left: number;
    };
  }>({});

  useEffect(() => {
    const rootElement = document.getElementById("window_splitter");

    const calculateOffset = (element: HTMLElement | null) => {
      let top = 0;
      let left = 0;
      while (element && element !== rootElement) {
        top += element.offsetTop;
        left += element.offsetLeft;
        element = element.offsetParent as HTMLElement;
      }
      return { top, left };
    };

    const updateDimensions = () => {
      const newDimensions = Object.keys(refs).reduce(
        (acc, key) => {
          const ref = refs[key];
          if (ref.current) {
            const { width, height } = ref.current.getBoundingClientRect();
            const { top, left } = calculateOffset(ref.current);
            acc[key] = {
              width,
              height,
              top,
              left,
            };
          }
          return acc;
        },
        {} as {
          [key: string]: {
            width: number;
            height: number;
            top: number;
            left: number;
          };
        }
      );
      setDimensions(newDimensions);
    };

    // 컴포넌트가 마운트된 후에 위치와 크기 설정
    updateDimensions();

    // 윈도우 리사이즈나 스크롤이 발생할 때마다 업데이트
    window.addEventListener("resize", updateDimensions);
    window.addEventListener("scroll", updateDimensions);

    return () => {
      window.removeEventListener("resize", updateDimensions);
      window.removeEventListener("scroll", updateDimensions);
    };
  }, [refs]);

  return (
    dimensions &&
    Object.keys(boxList).map((boxKey) => {
      if (boxList[boxKey].name === "ErrorBox") return undefined;
      return (
        <div
          className={`absolute z-20 overflow-hidden`}
          style={
            dimensions[boxKey]
              ? {
                  top: dimensions[boxKey].top,
                  left: dimensions[boxKey].left,
                  width: dimensions[boxKey].width,
                  height: dimensions[boxKey].height,
                }
              : undefined
          }
          key={`virtual+${boxList[boxKey].name}`}
        >
          {/* <div className="absolute">
            <h3>{boxKey}</h3>
            <p>Width: {dimensions[boxKey].width ?? ""}px</p>
            <p>Height: {dimensions[boxKey].height ?? ""}px</p>
            <p>Top: {dimensions[boxKey].top ?? ""}px</p>
            <p>Left: {dimensions[boxKey].left ?? ""}px</p>
          </div> */}
          {boxList[boxKey]()}
        </div>
      );
    })
  );
}
