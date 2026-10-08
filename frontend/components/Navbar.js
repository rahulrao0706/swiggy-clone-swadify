'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const pathname = usePathname();
  const { count } = useCart();
  const { user, logout } = useAuth();

  const links = [
    { href: '/', label: 'Home', icon: '🏠' },
    { href: '/orders', label: 'Orders', icon: '🧾' },
    { href: '/cart', label: 'Cart', icon: '🛒', badge: count },
    { href: user ? '/orders' : '/login', label: user ? user.name.split(' ')[0] : 'Sign in', icon: '👤', account: true },
  ];

  return (
    <>
      <header className="navbar">
        <div className="container nav-inner">
          <Link href="/" className="logo" aria-label="Swadify home">
            <span className="logo-mark">S</span>
            <span className="logo-text">Swadify</span>
          </Link>
          <span className="nav-location">Malviya Nagar, Jaipur</span>
          <nav className="nav-links" aria-label="Main">
            {links.map((l) => (
              <Link key={l.label} href={l.href} className={pathname === l.href && !l.account ? 'active' : ''}>
                <span aria-hidden>{l.icon}</span> {l.label}
                {l.badge > 0 && <span className="badge">{l.badge}</span>}
              </Link>
            ))}
            {user && (
              <button className="link-btn" onClick={logout}>
                Sign out
              </button>
            )}
          </nav>
        </div>
      </header>

      <nav className="bottom-nav" aria-label="Mobile">
        {links.map((l) => (
          <Link key={l.label} href={l.href} className={pathname === l.href && !l.account ? 'active' : ''}>
            <span className="bn-icon" aria-hidden>
              {l.icon}
              {l.badge > 0 && <span className="badge">{l.badge}</span>}
            </span>
            <span>{l.label}</span>
          </Link>
        ))}
      </nav>
    </>
  );
}
