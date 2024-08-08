import { useEffect, useRef, useState } from "react";

export default function BoxWindow({ color = "white", scale = 1 }) {
  const wsize = Math.min(Math.ceil(scale * 100), 100);
  const boxRef = useRef<HTMLDivElement | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [positioning, setPositioning] = useState("none");

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
        0 < mousePosition.x &&
        mousePosition.x <= 100 &&
        0 < mousePosition.y &&
        mousePosition.y <= 100
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
  return (
    <div
      className="flex flex-col"
      style={{
        width: `${wsize}%`,
      }}
    >
      <div className="bg-black text-white">nav</div>
      <div className={`relative h-full`} ref={boxRef}>
        <div className="absolute w-full h-full bg-white opacity-0 hover:opacity-50">
          Positioning: {positioning}, Mouse Position: {mousePosition.x}%,{" "}
          {mousePosition.y}%
        </div>
        <div
          className={`flex flex-col justify-center items-center w-full h-full bg-${color}-300`}
        >
          content
        </div>
      </div>
    </div>
  );
}
