'use client';
import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';

const CartContext = createContext(null);
export const useCart = () => useContext(CartContext);

const EMPTY = { restaurant: null, items: {} };

export function CartProvider({ children }) {
  const [cart, setCart] = useState(EMPTY);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('swadify_cart'));
      if (saved?.items) setCart(saved);
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem('swadify_cart', JSON.stringify(cart));
  }, [cart, ready]);

  // Returns false when the cart has another restaurant's items (caller can confirm, then pass replace=true)
  const addItem = useCallback(
    (restaurant, item, replace = false) => {
      const otherRestaurant = cart.restaurant && cart.restaurant.id !== restaurant.id && Object.keys(cart.items).length > 0;
      if (otherRestaurant && !replace) return false;
      setCart((prev) => {
        const base = otherRestaurant ? EMPTY : prev;
        const existing = base.items[item.id];
        return {
          restaurant: { id: restaurant.id, name: restaurant.name, emoji: restaurant.emoji },
          items: {
            ...base.items,
            [item.id]: existing
              ? { ...existing, qty: existing.qty + 1 }
              : { id: item.id, name: item.name, price: item.price, veg: item.veg, qty: 1 },
          },
        };
      });
      return true;
    },
    [cart]
  );

  const changeQty = useCallback((id, delta) => {
    setCart((prev) => {
      const item = prev.items[id];
      if (!item) return prev;
      const items = { ...prev.items };
      if (item.qty + delta <= 0) delete items[id];
      else items[id] = { ...item, qty: item.qty + delta };
      return Object.keys(items).length ? { ...prev, items } : EMPTY;
    });
  }, []);

  const clear = useCallback(() => setCart(EMPTY), []);

  const value = useMemo(() => {
    const list = Object.values(cart.items);
    return {
      restaurant: cart.restaurant,
      items: list,
      itemMap: cart.items,
      count: list.reduce((s, i) => s + i.qty, 0),
      subtotal: list.reduce((s, i) => s + i.price * i.qty, 0),
      ready,
      addItem,
      changeQty,
      clear,
    };
  }, [cart, ready, addItem, changeQty, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
