"use client";

import { useEffect, useState } from "react";
import useLocalStorage from "./hooks/useLocalStorage";

export default function Navigator() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useLocalStorage<boolean>("WINDOW-SPLITER-DRAG");
  const [windowSelect, setWindowSelect] = useLocalStorage<string>("WINDOW-SPLITTER-SELECT");

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (isDragging) {
        setMousePosition({
          x: event.clientX,
          y: event.clientY,
        });
      }
    };

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isDragging])

  return (
    <div
      className="absolute bg-gray-200 rounded p-1 z-10"
      style={{
        left: `${mousePosition.x}px`,
        top: `${mousePosition.y + 40}px`,
        transform: "translate(-50%, -50%)",
        visibility: isDragging ? "visible" : "hidden",
      }}
    >
      {windowSelect}
    </div>
  );
}
