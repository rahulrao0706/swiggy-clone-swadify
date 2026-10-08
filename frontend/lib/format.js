export const rupees = (n) => `₹${Number(n).toLocaleString('en-IN')}`;

// Keep in sync with calcBill in backend/src/routes/orders.js
export const calcBill = (subtotal) => {
  const deliveryFee = subtotal === 0 || subtotal >= 399 ? 0 : 30;
  const taxes = Math.round(subtotal * 0.05);
  return { subtotal, deliveryFee, taxes, total: subtotal + deliveryFee + taxes };
};
