import React from "react";

export default function Modal({ open, title, children, onClose, onConfirm, confirmText="Confirmar" }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60">
      <div className="bg-zinc-900/95 rounded-2xl p-5 w-full max-w-md ring-1 ring-white/10">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button className="btn" onClick={onClose}>✕</button>
        </div>
        <div className="space-y-4">{children}</div>
        <div className="mt-5 flex justify-end gap-2">
          <button className="btn" onClick={onClose}>Cancelar</button>
          <button className="btn" onClick={onConfirm}>{confirmText}</button>
        </div>
      </div>
    </div>
  );
}
