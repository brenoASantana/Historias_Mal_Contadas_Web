import { useState } from "react";

export default function TerminalScene({ onNext }) {
  const [history, setHistory] = useState([
    "Você acorda em uma sala escura...",
    "Digite 'continuar' para seguir.",
  ]);
  const [input, setInput] = useState("");

  const handleCommand = () => {
    if (input.toLowerCase() === "continuar") {
      onNext("scene2d"); // muda de cena
    } else {
      setHistory([...history, `> ${input}`, "Comando não reconhecido."]);
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
          className="bg-black text-green-400 outline-none"
          autoFocus
        />
      </div>
    </div>
  );
}
