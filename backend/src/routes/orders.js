const router = require('express').Router();
const restaurants = require('../data/restaurants');
const { requireAuth } = require('../middleware/auth');

const orders = []; // in-memory

// Order progresses automatically so you can demo live tracking.
const STAGES = [
  { key: 'placed', label: 'Order placed', after: 0 },
  { key: 'preparing', label: 'Preparing your food', after: 20 },
  { key: 'out_for_delivery', label: 'Out for delivery', after: 60 },
  { key: 'delivered', label: 'Delivered', after: 120 },
];

const calcBill = (subtotal) => {
  const deliveryFee = subtotal >= 399 ? 0 : 30;
  const taxes = Math.round(subtotal * 0.05);
  return { subtotal, deliveryFee, taxes, total: subtotal + deliveryFee + taxes };
};

const withStatus = (order) => {
  const seconds = (Date.now() - order.createdAt) / 1000;
  const current = [...STAGES].reverse().find((s) => seconds >= s.after);
  return { ...order, status: current.key, stages: STAGES.map(({ key, label }) => ({ key, label })) };
};

router.use(requireAuth);

router.post('/', (req, res) => {
  const { restaurantId, items, address, paymentMethod } = req.body || {};
  const restaurant = restaurants.find((r) => r.id === restaurantId);
  if (!restaurant) return res.status(400).json({ message: 'Restaurant not found' });
  if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ message: 'Your cart is empty' });
  if (!address || address.trim().length < 8) return res.status(400).json({ message: 'Please enter a complete delivery address' });

  // Prices always come from the server, never from the client.
  const lines = [];
  for (const { id, qty } of items) {
    const menuItem = restaurant.menu.find((m) => m.id === id);
    const quantity = Number(qty);
    if (!menuItem || !Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({ message: 'Invalid item in cart' });
    }
    lines.push({ id: menuItem.id, name: menuItem.name, price: menuItem.price, veg: menuItem.veg, qty: quantity });
  }

  const subtotal = lines.reduce((sum, l) => sum + l.price * l.qty, 0);
  const order = {
    id: `SW${Date.now().toString().slice(-8)}`,
    userId: req.user.id,
    restaurant: { id: restaurant.id, name: restaurant.name, emoji: restaurant.emoji },
    items: lines,
    bill: calcBill(subtotal),
    address: address.trim(),
    paymentMethod: paymentMethod || 'COD',
    createdAt: Date.now(),
  };
  orders.push(order);
  res.status(201).json(withStatus(order));
});

router.get('/', (req, res) => {
  const mine = orders.filter((o) => o.userId === req.user.id).reverse();
  res.json(mine.map(withStatus));
});

router.get('/:id', (req, res) => {
  const order = orders.find((o) => o.id === req.params.id && o.userId === req.user.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  res.json(withStatus(order));
});

module.exports = router;
