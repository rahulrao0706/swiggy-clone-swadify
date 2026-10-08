export default function Hero({ value, onChange }) {
  return (
    <section className="hero">
      <div className="container hero-inner">
        <h1>Hungry? Get it delivered in minutes.</h1>
        <p>Order from restaurants around Malviya Nagar, Jaipur.</p>
        <label className="search">
          <span className="sr-only">Search restaurants or dishes</span>
          <span aria-hidden>🔍</span>
          <input
            type="search"
            placeholder="Search for restaurants or dishes"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        </label>
      </div>
    </section>
  );
}
