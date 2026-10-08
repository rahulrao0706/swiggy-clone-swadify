import Link from 'next/link';
import { rupees } from '@/lib/format';

export default function RestaurantCard({ r }) {
  return (
    <Link href={`/restaurant/${r.id}`} className="card">
      <div className="card-media" style={{ background: r.color }}>
        <span className="card-emoji" aria-hidden>
          {r.emoji}
        </span>
        <span className="card-offer">{r.offer}</span>
      </div>
      <div className="card-body">
        <h3>{r.name}</h3>
        <p className="meta">
          <span className="rating">★ {r.rating}</span>
          <span>{r.eta} mins</span>
        </p>
        <p className="muted clamp">{r.cuisines.join(', ')}</p>
        <p className="muted">
          {r.area} · {rupees(r.costForTwo)} for two
        </p>
      </div>
    </Link>
  );
}
