export function Checkpoint({ prompt, answer }: { prompt: string; answer: string }) {
  return (
    <details className="checkpoint">
      <summary>
        <span>Prediction checkpoint</span>
        <strong>{prompt}</strong>
      </summary>
      <div>
        <span>Answer</span>
        <p>{answer}</p>
      </div>
    </details>
  );
}
