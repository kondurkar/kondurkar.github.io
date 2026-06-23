// src/pages/Games/Card28/CancelledModal.jsx

export default function CancelledModal({ reason, onAcknowledge }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(8,12,16,0.92)", backdropFilter: "blur(8px)" }}>
      <div className="bg-[#0d1117] border border-amber-500/30 rounded-2xl p-6 w-full max-w-sm text-center">
        <div className="text-4xl mb-3">🔄</div>
        <h2 className="font-display text-[1.5rem] font-extrabold text-amber-400 mb-2">
          Round Cancelled
        </h2>
        <p className="font-mono text-[12px] text-slate-500 mb-5">{reason}</p>
        <button onClick={onAcknowledge}
          className="w-full bg-cyan-400 hover:bg-cyan-300 text-black font-mono text-[12px]
                     tracking-widest py-3 rounded-sm transition-all duration-200">
          Redeal
        </button>
      </div>
    </div>
  );
}
