import { useState, useEffect } from "react";

// Exemplo de import JSON de uma cena
import sceneJSON from "/src/assets/texts/intro.json"; // ajuste o caminho conforme necessário

export default function TerminalScene({ onNext }) {
  const [history, setHistory] = useState([]); // linhas exibidas
  const [input, setInput] = useState("");
  const [currentLine, setCurrentLine] = useState(""); // linha sendo digitada
  const [charIndex, setCharIndex] = useState(0);
  const [scene, setScene] = useState(sceneJSON); // cena atual

  // efeito typewriter
  useEffect(() => {
    if (charIndex < scene.description.length) {
      const timeout = setTimeout(() => {
        setCurrentLine((prev) => prev + scene.description[charIndex]);
        setCharIndex(charIndex + 1);
      }, 20); // velocidade do texto
      return () => clearTimeout(timeout);
    } else if (!history.includes(scene.description)) {
      setHistory((prev) => [...prev, scene.description]);
    }
  }, [charIndex, scene.description, history]);

  const handleCommand = () => {
    const command = input.trim().toLowerCase();

    // procura ação correspondente no JSON
    const option = scene.options.find(
      (opt) => opt.text.toLowerCase() === command
    );

    if (option) {
      // aqui você poderia importar dinamicamente o próximo JSON
      // para simplificar, vamos apenas chamar onNext com o id da próxima cena
      onNext(option.nextScene);
    } else {
      setHistory((prev) => [...prev, `> ${input}`, "Comando não reconhecido."]);
    }
    setInput("");
  };

  return (
    <div className="bg-black text-green-400 font-mono p-4 h-screen">
      {history.map((line, i) => (
        <p key={i}>{line}</p>
      ))}
      <div>
        <span> </span>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCommand()}
          className="bg-black text-green-400 outline-none w-64"
          autoFocus
        />
      </div>
    </div>
  );
}
