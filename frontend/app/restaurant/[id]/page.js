'use client';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import RestaurantHeader from '@/components/RestaurantHeader';
import MenuItem from '@/components/MenuItem';
import CartBar from '@/components/CartBar';
import EmptyState from '@/components/EmptyState';

export default function RestaurantPage() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [error, setError] = useState('');
  const [vegOnly, setVegOnly] = useState(false);

  useEffect(() => {
    api.getRestaurant(id).then(setRestaurant).catch((e) => setError(e.message));
  }, [id]);

  const sections = useMemo(() => {
    if (!restaurant) return [];
    const map = new Map();
    restaurant.menu
      .filter((m) => !vegOnly || m.veg)
      .forEach((m) => map.set(m.category, [...(map.get(m.category) || []), m]));
    return [...map.entries()];
  }, [restaurant, vegOnly]);

  if (error) return <EmptyState emoji="😕" title="Couldn't load this restaurant" text={error} />;
  if (!restaurant) return <div className="container section"><div className="sk-line w60" /></div>;

  return (
    <>
      <RestaurantHeader r={restaurant} />
      <div className="container section menu-wrap">
        <label className="toggle">
          <input type="checkbox" checked={vegOnly} onChange={(e) => setVegOnly(e.target.checked)} />
          <span>Veg only</span>
        </label>

        {sections.map(([category, items]) => (
          <section key={category} className="menu-section">
            <h2>
              {category} ({items.length})
            </h2>
            <ul className="menu-list">
              {items.map((item) => (
                <MenuItem key={item.id} item={item} restaurant={restaurant} />
              ))}
            </ul>
          </section>
        ))}
        {sections.length === 0 && <p className="muted">No veg items on this menu.</p>}
      </div>
      <CartBar />
    </>
  );
}
