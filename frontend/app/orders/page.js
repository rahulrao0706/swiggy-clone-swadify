'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { rupees } from '@/lib/format';
import EmptyState from '@/components/EmptyState';

const LABELS = { placed: 'Order placed', preparing: 'Preparing', out_for_delivery: 'Out for delivery', delivered: 'Delivered' };

export default function OrdersPage() {
  const router = useRouter();
  const { user, ready } = useAuth();
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!ready) return;
    if (!user) return router.replace('/login?next=/orders');
    api.getOrders().then(setOrders).catch((e) => setError(e.message));
  }, [ready, user, router]);

  if (error) return <EmptyState emoji="😕" title="Couldn't load orders" text={error} />;
  if (!orders) return null;
  if (orders.length === 0) return <EmptyState emoji="🧾" title="No orders yet" text="Your past orders will show up here." />;

  return (
    <div className="container section narrow">
      <h1>Your orders</h1>
      <ul className="order-list">
        {orders.map((o) => (
          <li key={o.id}>
            <Link href={`/orders/${o.id}`} className="order-card">
              <span className="order-emoji" aria-hidden>{o.restaurant.emoji}</span>
              <div>
                <h3>{o.restaurant.name}</h3>
                <p className="muted small">
                  {o.items.map((i) => `${i.name} × ${i.qty}`).join(', ')}
                </p>
                <p className="muted small">{new Date(o.createdAt).toLocaleString('en-IN')}</p>
              </div>
              <div className="order-side">
                <strong>{rupees(o.bill.total)}</strong>
                <span className={`status ${o.status}`}>{LABELS[o.status]}</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
