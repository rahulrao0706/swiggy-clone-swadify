export default function VegMark({ veg }) {
  return (
    <span className={`vegmark ${veg ? 'veg' : 'nonveg'}`} title={veg ? 'Vegetarian' : 'Non-vegetarian'} role="img" aria-label={veg ? 'Vegetarian' : 'Non-vegetarian'}>
      <span />
    </span>
  );
}
