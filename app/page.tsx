"use client";

import { useState, useEffect, Fragment } from "react";
import { Splitter } from "./types/Slplitter";
import { UseSplitInfo } from "./types/UseSplitInfo";
import { BoxWindowObject } from "./types/BoxWindowObject";
import useSplitInfo from "./hooks/useSplitInfo";
import SpliterWindow from "./components/SpliterWindow";

export default function Home() {
  const [splitInfo, setSplitInfo]: UseSplitInfo =
    useSplitInfo("WINDOW-SPLITER");

  function isSplitter(box: any): box is Splitter {
    return (box as Splitter).isVertical !== undefined;
  }

  const splitter: Splitter = {
    isVertical: true,
    childs: splitInfo.childs.map((box, index) => {
      if (isSplitter(box)) {
        return {
          isVertical: box.isVertical,
          childs: box.childs,
        };
      } else {
        return {
          color: box.color,
          scale: box.scale,
        };
      }
    }),
  };

  useEffect(() => {
    console.log(splitInfo);
  }, [splitInfo]);

  return (
    <main className="flex items-stretch justify-stretch h-screen">
      {
        <SpliterWindow
          isVertical={splitter.isVertical}
          childs={splitter.childs}
        />
      }
    </main>
  );
}
