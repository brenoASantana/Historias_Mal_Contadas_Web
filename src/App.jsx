import { useState, useRef, useEffect } from "react";
import TerminalScene from "./scenes/TerminalScene";
import Scene2D from "./scenes/Scene2D";
import Scene3D from "./scenes/Scene3D";

// --- CONSTANTES DE ÁUDIO ---
const BACKGROUND_MUSIC = "/music/a_warning_before_reading.mp3";
const CLICK_SOUND = "/sounds/click.wav";

export default function App() {
  const [scene, setScene] = useState("terminal");
  const musicRef = useRef(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  useEffect(() => {
    if (musicRef.current) {
      musicRef.current.loop = true;
      if (isMusicPlaying) {
        musicRef.current
          .play()
          .catch((e) => console.error("Reprodução automática bloqueada", e));
      } else {
        musicRef.current.pause();
      }
    }
  }, [isMusicPlaying]);

  const playSound = (soundFile) => {
    const audio = new Audio(soundFile);
    audio.play().catch((e) => console.error("Erro ao tocar o som", e));
  };

  const handleToggleMusic = () => {
    playSound(CLICK_SOUND);
    setIsMusicPlaying(!isMusicPlaying);
  };

  return (
    <div
      className="game-container"
      style={{ width: "100vw", height: "100vh", backgroundColor: "#000" }}
    >
      <audio ref={musicRef} src={BACKGROUND_MUSIC} />
      <div style={{ position: "absolute", top: 10, right: 10, zIndex: 100 }}>
        <button
          onClick={handleToggleMusic}
          style={{ padding: "8px 12px", cursor: "pointer" }}
        >
          {isMusicPlaying ? "Pausar Música" : "Tocar Música"}
        </button>
      </div>

      {scene === "terminal" && (
        <TerminalScene onNext={setScene} playSound={playSound} />
      )}
      {scene === "scene2d" && (
        <Scene2D onNext={setScene} playSound={playSound} />
      )}
      {scene === "scene3d" && (
        <Scene3D onNext={setScene} playSound={playSound} />
      )}
    </div>
  );
}
