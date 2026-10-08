export default function Skeleton({ count = 6 }) {
  return (
    <div className="grid" aria-busy="true" aria-label="Loading">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card skeleton">
          <div className="card-media" />
          <div className="card-body">
            <div className="sk-line w60" />
            <div className="sk-line w40" />
            <div className="sk-line w80" />
          </div>
        </div>
      ))}
    </div>
  );
}
