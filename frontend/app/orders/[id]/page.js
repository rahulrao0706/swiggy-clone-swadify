'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { rupees } from '@/lib/format';
import OrderTracker from '@/components/OrderTracker';
import BillDetails from '@/components/BillDetails';
import EmptyState from '@/components/EmptyState';

export default function OrderPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, ready } = useAuth();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!ready) return;
    if (!user) return router.replace(`/login?next=/orders/${id}`);
    let timer;
    const load = async () => {
      try {
        const data = await api.getOrder(id);
        setOrder(data);
        if (data.status !== 'delivered') timer = setTimeout(load, 5000); // live status polling
      } catch (e) {
        setError(e.message);
      }
    };
    load();
    return () => clearTimeout(timer);
  }, [ready, user, id, router]);

  if (error) return <EmptyState emoji="😕" title="Couldn't load this order" text={error} href="/orders" cta="View all orders" />;
  if (!order) return null;

  return (
    <div className="container section two-col">
      <section>
        <h1>{order.status === 'delivered' ? 'Delivered. Enjoy your meal!' : 'Your order is on its way'}</h1>
        <p className="muted">Order #{order.id} · {order.restaurant.emoji} {order.restaurant.name}</p>

        <div className="panel">
          <OrderTracker stages={order.stages} status={order.status} />
        </div>

        <div className="panel">
          <h3>Delivering to</h3>
          <p>{order.address}</p>
          <p className="muted small">Payment: {order.paymentMethod}</p>
        </div>

        <div className="panel">
          <h3>Items</h3>
          <ul className="cart-list">
            {order.items.map((i) => (
              <li key={i.id} className="cart-line simple">
                <span>{i.name} × {i.qty}</span>
                <span>{rupees(i.price * i.qty)}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <aside>
        <BillDetails bill={order.bill} />
      </aside>
    </div>
  );
}
