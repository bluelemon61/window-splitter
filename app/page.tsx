"use client";

import { UseSplitInfo } from "./types/UseSplitInfo";
import useSplitInfo from "./hooks/useSplitInfo";
import SpliterWindow from "./components/SpliterWindow";

export default function Home() {
  const [splitInfo, setSplitInfo]: UseSplitInfo = useSplitInfo("WINDOW-SPLITER");

  return (
    <main className="flex items-stretch justify-stretch h-screen">
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
