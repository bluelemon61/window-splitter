"use client";

import { useEffect, useState } from "react";
import useLocalStorage from "./hooks/useLocalStorage";

export default function Navigator() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [isDragging, setIsDragging] = useLocalStorage<boolean>("WINDOW-SPLITTER-DRAG");
  const [windowSelect, setWindowSelect] = useLocalStorage<string>("WINDOW-SPLITTER-SELECT");

  useEffect(() => {
    if (!isDragging) setIsVisible(false);

    const handleMouseMove = (event: MouseEvent) => {
      if (isDragging) {
        setIsVisible(true);
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
  }, [isDragging]);

  return (
    <div
      className="absolute bg-gray-200 rounded p-1 z-30"
      style={{
        left: `${mousePosition.x}px`,
        top: `${mousePosition.y + 40}px`,
        transform: "translate(-50%, -50%)",
        visibility: isVisible ? "visible" : "hidden",
      }}
    >
      {windowSelect}
    </div>
  );
}
