import Link from 'next/link';

export default function EmptyState({ emoji, title, text, href = '/', cta = 'Browse restaurants' }) {
  return (
    <div className="empty">
      <div className="empty-emoji" aria-hidden>
        {emoji}
      </div>
      <h2>{title}</h2>
      <p className="muted">{text}</p>
      <Link href={href} className="btn">
        {cta}
      </Link>
    </div>
  );
}
