'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { calcBill, rupees } from '@/lib/format';
import BillDetails from '@/components/BillDetails';
import EmptyState from '@/components/EmptyState';

export default function CheckoutPage() {
  const router = useRouter();
  const { user, ready: authReady } = useAuth();
  const { items, restaurant, subtotal, clear, ready } = useCart();
  const [address, setAddress] = useState('');
  const [payment, setPayment] = useState('COD');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (authReady && !user) router.replace('/login?next=/checkout');
  }, [authReady, user, router]);

  if (!ready || !authReady || !user) return null;
  if (items.length === 0) return <EmptyState emoji="🛒" title="Nothing to check out" text="Your cart is empty." />;

  const bill = calcBill(subtotal);

  const placeOrder = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const order = await api.createOrder({
        restaurantId: restaurant.id,
        items: items.map((i) => ({ id: i.id, qty: i.qty })),
        address,
        paymentMethod: payment,
      });
      clear();
      router.push(`/orders/${order.id}`);
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <form className="container section two-col" onSubmit={placeOrder}>
      <section>
        <h1>Checkout</h1>

        <div className="panel">
          <h3>Delivery address</h3>
          <label className="field">
            Full address
            <textarea
              required
              rows={3}
              placeholder="Flat / house no., street, landmark, Jaipur"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </label>
        </div>

        <div className="panel">
          <h3>Payment method</h3>
          {[
            ['COD', 'Cash on delivery'],
            ['UPI', 'UPI (demo, no real payment)'],
            ['CARD', 'Card (demo, no real payment)'],
          ].map(([value, label]) => (
            <label key={value} className="radio">
              <input type="radio" name="payment" value={value} checked={payment === value} onChange={() => setPayment(value)} />
              {label}
            </label>
          ))}
        </div>
      </section>

      <aside>
        <p className="muted">{restaurant.emoji} {restaurant.name}</p>
        <BillDetails bill={bill} />
        {error && <p className="error-box" role="alert">{error}</p>}
        <button className="btn block" disabled={busy}>
          {busy ? 'Placing order…' : `Place order · ${rupees(bill.total)}`}
        </button>
      </aside>
    </form>
  );
}
