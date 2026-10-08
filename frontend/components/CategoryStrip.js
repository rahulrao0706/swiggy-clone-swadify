export const CATEGORIES = [
  { name: 'Biryani', emoji: '🍛' },
  { name: 'Pizza', emoji: '🍕' },
  { name: 'South Indian', emoji: '🥘' },
  { name: 'Burgers', emoji: '🍔' },
  { name: 'Chinese', emoji: '🥡' },
  { name: 'Desserts', emoji: '🍰' },
  { name: 'North Indian', emoji: '🍗' },
  { name: 'Healthy', emoji: '🥗' },
  { name: 'Street Food', emoji: '☕' },
];

export default function CategoryStrip({ selected, onSelect }) {
  return (
    <section className="container section">
      <h2>What's on your mind?</h2>
      <div className="categories" role="list">
        {CATEGORIES.map((c) => (
          <button
            key={c.name}
            role="listitem"
            className={`category ${selected === c.name ? 'selected' : ''}`}
            aria-pressed={selected === c.name}
            onClick={() => onSelect(selected === c.name ? '' : c.name)}
          >
            <span className="category-emoji" aria-hidden>
              {c.emoji}
            </span>
            <span>{c.name}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
