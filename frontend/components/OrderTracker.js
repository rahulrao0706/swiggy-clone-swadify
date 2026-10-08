export default function OrderTracker({ stages, status }) {
  const current = stages.findIndex((s) => s.key === status);
  return (
    <ol className="tracker">
      {stages.map((s, i) => (
        <li key={s.key} className={i < current ? 'done' : i === current ? 'current' : ''}>
          <span className="dot" aria-hidden>
            {i <= current ? '✓' : ''}
          </span>
          <span>{s.label}</span>
        </li>
      ))}
    </ol>
  );
}
