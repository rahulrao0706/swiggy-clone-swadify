'use client';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { calcBill, rupees } from '@/lib/format';
import BillDetails from '@/components/BillDetails';
import EmptyState from '@/components/EmptyState';
import QtyControl from '@/components/QtyControl';
import VegMark from '@/components/VegMark';

export default function CartPage() {
  const { items, restaurant, subtotal, changeQty, clear, ready } = useCart();
  if (!ready) return null;
  if (items.length === 0) {
    return <EmptyState emoji="🛒" title="Your cart is empty" text="Add something tasty from a restaurant to get started." />;
  }
  const bill = calcBill(subtotal);

  return (
    <div className="container section two-col">
      <section>
        <div className="row-between">
          <div>
            <h1>Cart</h1>
            <Link href={`/restaurant/${restaurant.id}`} className="muted">
              {restaurant.emoji} {restaurant.name}
            </Link>
          </div>
          <button className="link-btn" onClick={clear}>Clear cart</button>
        </div>

        <ul className="cart-list">
          {items.map((i) => (
            <li key={i.id} className="cart-line">
              <div className="cart-name">
                <VegMark veg={i.veg} />
                <span>{i.name}</span>
              </div>
              <QtyControl name={i.name} qty={i.qty} onInc={() => changeQty(i.id, 1)} onDec={() => changeQty(i.id, -1)} />
              <span className="line-price">{rupees(i.price * i.qty)}</span>
            </li>
          ))}
        </ul>
      </section>

      <aside>
        <BillDetails bill={bill} />
        <Link href="/checkout" className="btn block">Proceed to checkout</Link>
      </aside>
    </div>
  );
}
