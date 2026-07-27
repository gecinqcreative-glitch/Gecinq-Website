// Révélation de titre "par mot" (masque + montée), effet éditorial premium.
// Chaque mot est dans un conteneur overflow-hidden ; l'intérieur monte de 110% → 0
// avec un léger décalage (stagger). Utilisable dans un composant serveur.

export default function SplitText({
  text,
  className = '',
  delay = 0,
  stagger = 55,
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
}) {
  const words = text.split(' ');
  return (
    <span className={className} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} className="split-word" aria-hidden>
          <span
            className="split-inner"
            style={{ animationDelay: `${delay + i * stagger}ms` }}
          >
            {w}
            {i < words.length - 1 ? ' ' : ''}
          </span>
        </span>
      ))}
    </span>
  );
}
