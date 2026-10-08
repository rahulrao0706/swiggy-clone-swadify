import { rupees } from '@/lib/format';

export default function BillDetails({ bill }) {
  return (
    <div className="bill">
      <h3>Bill details</h3>
      <div className="row">
        <span>Item total</span>
        <span>{rupees(bill.subtotal)}</span>
      </div>
      <div className="row">
        <span>Delivery fee</span>
        <span>{bill.deliveryFee === 0 ? 'FREE' : rupees(bill.deliveryFee)}</span>
      </div>
      <div className="row">
        <span>Taxes (5%)</span>
        <span>{rupees(bill.taxes)}</span>
      </div>
      <div className="row total">
        <span>To pay</span>
        <span>{rupees(bill.total)}</span>
      </div>
      {bill.deliveryFee > 0 && <p className="muted small">Free delivery on orders of ₹399 and above.</p>}
    </div>
  );
}
