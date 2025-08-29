import intro from "@/assets/texts/intro.json";

function Scene() {
  return (
    <div>
      <h1>{intro.title}</h1>
      <p>{intro.description}</p>
      <ul>
        {intro.options.map((opt, i) => (
          <li key={i}>{opt.text}</li>
        ))}
      </ul>
    </div>
  );
}
