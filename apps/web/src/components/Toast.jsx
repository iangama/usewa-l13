import React, { useEffect } from "react";

export default function Toast({ message, show, onHide, timeout=2500 }) {
  useEffect(() => {
    if (!show) return;
    const t = setTimeout(() => onHide?.(), timeout);
    return () => clearTimeout(t);
  }, [show, timeout, onHide]);
  return (
    <div className={`fixed bottom-4 right-4 transition-all ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"} `}>
      <div className="bg-zinc-900/95 border border-white/10 rounded-xl px-4 py-3 shadow-xl">{message}</div>
    </div>
  );
}
