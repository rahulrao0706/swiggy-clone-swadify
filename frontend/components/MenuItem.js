'use client';
import { useCart } from '@/context/CartContext';
import { rupees } from '@/lib/format';
import VegMark from './VegMark';
import QtyControl from './QtyControl';

export default function MenuItem({ item, restaurant }) {
  const { itemMap, addItem, changeQty } = useCart();
  const qty = itemMap[item.id]?.qty || 0;

  const handleAdd = () => {
    if (!addItem(restaurant, item)) {
      const ok = window.confirm('Your cart has items from another restaurant. Clear it and add this item?');
      if (ok) addItem(restaurant, item, true);
    }
  };

  return (
    <li className="menu-item">
      <div className="menu-info">
        <VegMark veg={item.veg} />
        <h4>{item.name}</h4>
        <p className="price">{rupees(item.price)}</p>
        <p className="muted desc">{item.description}</p>
      </div>
      <QtyControl
        name={item.name}
        qty={qty}
        onAdd={handleAdd}
        onInc={() => changeQty(item.id, 1)}
        onDec={() => changeQty(item.id, -1)}
      />
    </li>
  );
}
