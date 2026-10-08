import { rupees } from '@/lib/format';

export default function RestaurantHeader({ r }) {
  return (
    <section className="r-header" style={{ background: r.color }}>
      <div className="container r-header-inner">
        <span className="r-emoji" aria-hidden>
          {r.emoji}
        </span>
        <div>
          <h1>{r.name}</h1>
          <p className="muted">{r.cuisines.join(', ')}</p>
          <p className="muted">{r.area}, Jaipur</p>
          <p className="meta">
            <span className="rating">★ {r.rating}</span>
            <span>{r.eta} mins</span>
            <span>{rupees(r.costForTwo)} for two</span>
          </p>
          <p className="offer-pill">🏷️ {r.offer}</p>
        </div>
      </div>
    </section>
  );
}
