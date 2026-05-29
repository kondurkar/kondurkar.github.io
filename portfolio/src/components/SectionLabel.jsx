export default function SectionLabel({ index, label }) {
  return (
    <div className="flex items-center gap-3 font-mono text-[12px] text-cyan-400
                    tracking-[0.2em] uppercase mb-3">
      {index} — {label}
      <span className="h-px w-[60px] bg-cyan-400 opacity-40" />
    </div>
  );
}
