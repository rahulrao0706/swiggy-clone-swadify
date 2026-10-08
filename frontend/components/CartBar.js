'use client';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { rupees } from '@/lib/format';

export default function CartBar() {
  const { count, subtotal } = useCart();
  if (!count) return null;
  return (
    <Link href="/cart" className="cart-bar">
      <span>
        {count} item{count > 1 ? 's' : ''} · {rupees(subtotal)}
      </span>
      <strong>View cart</strong>
    </Link>
  );
}
