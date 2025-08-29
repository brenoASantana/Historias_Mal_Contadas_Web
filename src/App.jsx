import { useState, useRef, useEffect } from "react";

// --- CONSTANTES DE ÁUDIO ---
// Coloque os seus ficheiros na pasta /public
const BACKGROUND_MUSIC = "/music/a_warning_before_reading.mp3";
const CLICK_SOUND = "/sounds/click.wav";
const TYPEWRITER_SOUND = "/sounds/explosion.mp3";
const ERROR_SOUND = "/sounds/jumpscare.ogg";

// --- COMPONENTES DE CENA ---

function TerminalScene({ onNext, playSound }) {
  const [sceneData, setSceneData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState("");
  const [currentLine, setCurrentLine] = useState("");
  const [charIndex, setCharIndex] = useState(0);

  // Efeito para carregar os dados da cena do ficheiro JSON
  useEffect(() => {
    fetch("/assets/texts/intro.json")
      .then(res => res.json())
      .then(data => {
        setSceneData(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Erro ao carregar dados da cena:", error);
        setHistory(["Erro: Não foi possível carregar a cena."]);
        setIsLoading(false);
      });
  }, []);

  // Efeito "máquina de escrever"
  useEffect(() => {
    if (isLoading || !sceneData) return;

    if (charIndex < sceneData.description.length) {
      const timeout = setTimeout(() => {
        setCurrentLine(prev => prev + sceneData.description[charIndex]);
        setCharIndex(charIndex + 1);
        if (charIndex % 2 === 0) playSound(TYPEWRITER_SOUND);
      }, 40);
      return () => clearTimeout(timeout);
    } else if (!history.includes(sceneData.description)) {
      setHistory(prev => [...prev, sceneData.description]);
    }
  }, [charIndex, history, playSound, sceneData, isLoading]);

  const handleCommand = () => {
    if (isLoading || !sceneData) return;
    const command = input.trim().toLowerCase();
    const option = sceneData.options.find(opt => opt.text.toLowerCase() === command);

    if (option) {
      onNext(option.nextScene);
    } else {
      playSound(ERROR_SOUND);
      setHistory(prev => [...prev, `> ${input}`, "Comando não reconhecido."]);
    }
    setInput("");
  };

  if (isLoading) {
    return <div className="bg-black text-green-400 font-mono p-4 h-screen w-full flex items-center justify-center"><p>A carregar...</p></div>;
  }

  return (
    <div className="bg-black text-green-400 font-mono p-4 h-screen w-full flex flex-col justify-end">
      <div>
        {history.map((line, i) => <p key={i}>{line}</p>)}
        <p>{currentLine}<span className="animate-ping">_</span></p>
      </div>
      <div className="flex">
        <span>&gt;</span>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleCommand()}
          className="bg-black text-green-400 outline-none w-full ml-2"
          autoFocus
        />
      </div>
    </div>
  );
}

function Scene2D({ onNext, playSound }) {
  // Componente de placeholder para a sua cena 2D
  return (
    <div className="text-white p-8">
      <h2>Cena 2D</h2>
      <button onClick={() => onNext('scene3d')}>Avançar para Cena 3D</button>
    </div>
  );
}

function Scene3D({ onNext, playSound }) {
  // Componente de placeholder para a sua cena 3D
  return (
    <div className="text-white p-8">
      <h2>Cena 3D</h2>
      <button onClick={() => onNext('terminal')}>Voltar ao início</button>
    </div>
  );
}


// --- COMPONENTE PRINCIPAL ---
export default function App() {
  const [scene, setScene] = useState("terminal");
  const musicRef = useRef(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  useEffect(() => {
    if (musicRef.current) {
      musicRef.current.loop = true;
      if (isMusicPlaying) {
        musicRef.current.play().catch(e => console.error("Reprodução automática bloqueada", e));
      } else {
        musicRef.current.pause();
      }
    }
  }, [isMusicPlaying]);

  const playSound = (soundFile) => {
    const audio = new Audio(soundFile);
    audio.play().catch(e => console.error("Erro ao tocar o som", e));
  };

  const handleToggleMusic = () => {
    playSound(CLICK_SOUND);
    setIsMusicPlaying(!isMusicPlaying);
  };

  return (
    <div className="game-container" style={{ width: '100vw', height: '100vh', backgroundColor: '#000' }}>
      <audio ref={musicRef} src={BACKGROUND_MUSIC} />
      <div style={{ position: "absolute", top: 10, right: 10, zIndex: 100 }}>
        <button onClick={handleToggleMusic} style={{padding: '8px 12px', cursor: 'pointer'}}>
          {isMusicPlaying ? "Pausar Música" : "Tocar Música"}
        </button>
      </div>

      {scene === "terminal" && <TerminalScene onNext={setScene} playSound={playSound} />}
      {scene === "scene2d" && <Scene2D onNext={setScene} playSound={playSound} />}
      {scene === "scene3d" && <Scene3D onNext={setScene} playSound={playSound} />}
    </div>
  );
}

