export default function QtyControl({ qty, onAdd, onInc, onDec, name }) {
  if (!qty) {
    return (
      <button className="add-btn" onClick={onAdd} aria-label={`Add ${name}`}>
        ADD
      </button>
    );
  }
  return (
    <div className="qty" role="group" aria-label={`Quantity of ${name}`}>
      <button onClick={onDec} aria-label="Decrease quantity">
        −
      </button>
      <span>{qty}</span>
      <button onClick={onInc} aria-label="Increase quantity">
        +
      </button>
    </div>
  );
}
