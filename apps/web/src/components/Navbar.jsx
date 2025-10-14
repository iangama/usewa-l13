import React from "react";

export default function Navbar({ onToggleSidebar }) {
  return (
    <header className="sticky top-0 z-30 backdrop-blur bg-zinc-900/60 border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <button onClick={onToggleSidebar} className="btn">☰</button>
        <div className="text-lg font-semibold tracking-wide">usewa — L13</div>
        <div className="opacity-70 text-sm">Traefik SAFE :8880/:8443</div>
      </div>
    </header>
  );
}
