import { useState } from "react";

export default function Blue() {
  const [text, setText] = useState("");

  return (
    <div className="bg-blue-300 h-full w-full p-2">
      <input value={text} onChange={(e) => setText(e.target.value)} />
    </div>
  );
}
