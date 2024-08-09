import { Fragment } from "react";
import { Splitter } from "../types/Slplitter";
import BoxWindow from "./BoxWindow";

export default function SpliterWindow({
  isVertical = false,
  childs = [],
  address,
}: Splitter) {
  const wsize = 100;

  function isSplitter(box: any): box is Splitter {
    return (box as Splitter).isVertical !== undefined;
  }

  return (
    <div className={`flex items-stretch justify-stretch w-full h-full ${isVertical ? 'flex-col' : ''}`}>
      {
        childs.map((box, index) => {
          if (isSplitter(box)) {
            return (
              <Fragment key={index}>
                {
                  // 각 window 사이의 구분 선
                  index > 0 && <div className="border-2 border-gray-500" />
                }
                <SpliterWindow isVertical={box.isVertical} childs={box.childs} address={`${box.address}`}/>
              </Fragment>
            );
          } else {
            return (
              <Fragment key={index}>
                {
                  // 각 window 사이의 구분 선
                  index > 0 && <div className="border-2 border-gray-500" />
                }
                <BoxWindow childs={box.childs} scale={1} address={`${box.address}`}/>
              </Fragment>
            );
          }
        })
      }
    </div>
  )
  
}
