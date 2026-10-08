'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import Hero from '@/components/Hero';
import CategoryStrip from '@/components/CategoryStrip';
import FilterBar from '@/components/FilterBar';
import RestaurantCard from '@/components/RestaurantCard';
import Skeleton from '@/components/Skeleton';
import CartBar from '@/components/CartBar';

const DEFAULTS = { search: '', cuisine: '', veg: false, fast: false, minRating: 0, sort: 'relevance' };

export default function Home() {
  const [filters, setFilters] = useState(DEFAULTS);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const t = setTimeout(async () => {
      try {
        const data = await api.getRestaurants(filters);
        if (!cancelled) {
          setRestaurants(data);
          setError('');
        }
      } catch (e) {
        if (!cancelled) setError(e.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [filters]);

  return (
    <>
      <Hero value={filters.search} onChange={(search) => setFilters((f) => ({ ...f, search }))} />
      <CategoryStrip selected={filters.cuisine} onSelect={(cuisine) => setFilters((f) => ({ ...f, cuisine }))} />

      <section className="container section">
        <h2>{loading ? 'Restaurants' : `${restaurants.length} restaurants to explore`}</h2>
        <FilterBar filters={filters} onChange={setFilters} />

        {error && <p className="error-box" role="alert">{error}</p>}
        {loading && <Skeleton />}
        {!loading && !error && restaurants.length === 0 && (
          <div className="empty">
            <div className="empty-emoji" aria-hidden>🍽️</div>
            <h2>No restaurants match</h2>
            <p className="muted">Try a different search or clear the filters.</p>
            <button className="btn" onClick={() => setFilters(DEFAULTS)}>Clear filters</button>
          </div>
        )}
        {!loading && !error && (
          <div className="grid">
            {restaurants.map((r) => (
              <RestaurantCard key={r.id} r={r} />
            ))}
          </div>
        )}
      </section>
      <CartBar />
    </>
  );
}
