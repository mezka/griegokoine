export default function CardHeader({ label, right }) {
  return (
    <div className="flex items-baseline justify-between mb-5 pb-3 border-b border-solid border-line">
      <span className="font-sans text-[9px] tracking-[0.18em] uppercase text-ink-mid font-medium">{label}</span>
      {right && <span className="font-sans text-[9px] tracking-[0.12em] uppercase text-ink-fade font-medium">{right}</span>}
    </div>
  );
}
