import { useState } from "react";
import Scene2D from "./scenes/Scene2D";
import Scene3D from "./scenes/Scene3D";
import TerminalScene from "./scenes/TerminalScene";

export default function App() {
  const [scene, setScene] = useState("terminal");

  return (
    <>
      {scene === "terminal" && <TerminalScene onNext={setScene} />}
      {scene === "scene2d" && <Scene2D onNext={setScene} />}
      {scene === "scene3d" && <Scene3D onNext={setScene} />}
    </>
  );
}
