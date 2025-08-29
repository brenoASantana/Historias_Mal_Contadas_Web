import { useState, useEffect } from "react";

const TYPEWRITER_SOUND = "/sounds/explosion.mp3";
const ERROR_SOUND = "/sounds/jumpscare.ogg";

// 1. Receber 'playSound' como prop
export default function TerminalScene({ onNext, playSound }) {
  const [scene, setScene] = useState(null); // A cena começará como nula
  const [isLoading, setIsLoading] = useState(true); // Estado para controlar o carregamento

  const [history, setHistory] = useState([]);
  const [input, setInput] = useState("");
  const [currentLine, setCurrentLine] = useState("");
  const [charIndex, setCharIndex] = useState(0);

  // Efeito para ir buscar os dados da cena do ficheiro JSON
  useEffect(() => {
    // O fetch assume que o ficheiro está em /public/assets/texts/intro.json
    fetch("/assets/texts/intro.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Falha ao carregar o ficheiro da cena.");
        }
        return response.json();
      })
      .then((data) => {
        setScene(data); // Guarda os dados da cena no estado
        setIsLoading(false); // Marca o carregamento como concluído
      })
      .catch((error) => {
        console.error("Erro ao carregar os dados da cena:", error);
        setHistory(["Erro: Não foi possível carregar a cena."]);
        setIsLoading(false);
      });
  }, []); // O array vazio [] garante que este efeito corre apenas uma vez

  // Efeito "máquina de escrever"
  useEffect(() => {
    // Só executa se a cena já tiver sido carregada
    if (isLoading || !scene) return;

    if (charIndex < scene.description.length) {
      const timeout = setTimeout(() => {
        setCurrentLine((prev) => prev + scene.description[charIndex]);
        setCharIndex(charIndex + 1);
        if (charIndex % 2 === 0) {
          playSound(TYPEWRITER_SOUND);
        }
      }, 40);
      return () => clearTimeout(timeout);
    } else if (!history.includes(scene.description)) {
      setHistory((prev) => [...prev, scene.description]);
    }
  }, [charIndex, history, playSound, scene, isLoading]);

  const handleCommand = () => {
    if (isLoading || !scene) return; // Não processa comandos se a cena não estiver carregada

    const command = input.trim().toLowerCase();
    const option = scene.options.find(
      (opt) => opt.text.toLowerCase() === command
    );

    if (option) {
      onNext(option.nextScene);
    } else {
      playSound(ERROR_SOUND);
      setHistory((prev) => [...prev, `> ${input}`, "Comando não reconhecido."]);
    }
    setInput("");
  };

  // Mostra uma mensagem de carregamento enquanto os dados não chegam
  if (isLoading) {
    return (
      <div className="bg-black text-green-400 font-mono p-4 h-screen w-full flex items-center justify-center">
        <p>A carregar...</p>
      </div>
    );
  }

  return (
    <div className="bg-black text-green-400 font-mono p-4 h-screen w-full flex flex-col justify-end">
      <div>
        {history.map((line, i) => (
          <p key={i}>{line}</p>
        ))}
        {/* Adiciona um cursor a piscar no final da linha */}
        <p>
          {currentLine}
          <span className="animate-ping">_</span>
        </p>
      </div>
      <div className="flex">
        <span>&gt;</span>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCommand()}
          className="bg-black text-green-400 outline-none w-full ml-2"
          autoFocus
        />
      </div>
    </div>
  );
}
