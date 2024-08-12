"use client";

import { UseSplitInfo } from "./types/UseSplitInfo";
import useSplitInfo from "./hooks/useSplitInfo";
import SpliterWindow from "./components/SpliterWindow";

export default function Home() {
  const [splitInfo, setSplitInfo]: UseSplitInfo = useSplitInfo("WINDOW-SPLITTER");

  return (
    <main className="flex items-stretch justify-stretch w-full h-full">
      {
        <SpliterWindow
          isVertical={splitInfo.isVertical}
          childs={splitInfo.childs}
          address={splitInfo.address}
        />
      }
    </main>
  );
}
