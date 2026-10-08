export default function FilterBar({ filters, onChange }) {
  const toggle = (key) => onChange({ ...filters, [key]: !filters[key] });
  const chip = (key, label) => (
    <button className={`chip ${filters[key] ? 'on' : ''}`} aria-pressed={!!filters[key]} onClick={() => toggle(key)}>
      {label}
    </button>
  );

  return (
    <div className="filters">
      <select
        aria-label="Sort restaurants"
        value={filters.sort}
        onChange={(e) => onChange({ ...filters, sort: e.target.value })}
      >
        <option value="relevance">Relevance</option>
        <option value="rating">Rating: high to low</option>
        <option value="eta">Delivery time</option>
        <option value="costLow">Cost: low to high</option>
        <option value="costHigh">Cost: high to low</option>
      </select>
      {chip('fast', 'Fast delivery')}
      {chip('veg', 'Pure veg')}
      <button
        className={`chip ${filters.minRating === 4.5 ? 'on' : ''}`}
        aria-pressed={filters.minRating === 4.5}
        onClick={() => onChange({ ...filters, minRating: filters.minRating === 4.5 ? 0 : 4.5 })}
      >
        Rating 4.5+
      </button>
    </div>
  );
}
