import { useEffect, useRef } from "react";

export default function Scene2D({ onNext }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let x = 50,
      y = 50;
    let keys = {};

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "blue";
      ctx.fillRect(x, y, 30, 30);
    };

    const loop = () => {
      if (keys["ArrowUp"]) y -= 2;
      if (keys["ArrowDown"]) y += 2;
      if (keys["ArrowLeft"]) x -= 2;
      if (keys["ArrowRight"]) x += 2;

      draw();
      requestAnimationFrame(loop);
    };

    const handleKey = (e) => {
      keys[e.key] = e.type === "keydown";
    };

    window.addEventListener("keydown", handleKey);
    window.addEventListener("keyup", handleKey);
    loop();

    return () => {
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("keyup", handleKey);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={500}
      height={500}
      className="border border-white bg-gray-900"
    />
  );
}
