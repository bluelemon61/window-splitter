'use client'

import { useState, useEffect } from "react";
import BoxWindow from "./components/BoxWindow";
import { Splitter } from "./types/Slplitter";
import { BoxWindowObject } from "./types/BoxWindowObject";

export default function Home() {
  const boxWindowObject: BoxWindowObject = {
    boxWindow: BoxWindow,
  }

  const splitter: Splitter = {
    isVertical: true,
    childs: [boxWindowObject, boxWindowObject],
  }

  const [windowList, setwindowList] = useState(splitter);

  return (
    <main className="flex items-stretch justify-stretch h-screen">
      {
        splitter.childs.map((box, index) => {
          return (
            <>
              {
                // 각 window 사이의 구분 선
                index > 0
                ? <div className="border-2 border-gray-300"/>
                : null
              }
              <box.boxWindow
                scale={1}
                key={index}
              />
            </>
          )
        })
      }
    </main>
  );
}
