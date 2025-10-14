import React from "react";

export default function Sidebar({ open, current, setCurrent }) {
  const items = ["Dashboard","Catálogo","Pedidos","Notificações"];
  return (
    <aside className={`fixed left-0 top-14 bottom-0 w-64 transition-transform ${open ? "translate-x-0" : "-translate-x-64"} bg-zinc-900/70 border-r border-white/10`}>
      <nav className="p-3 space-y-1">
        {items.map(it => (
          <button key={it}
            onClick={()=>setCurrent(it)}
            className={`w-full text-left px-3 py-2 rounded-xl ${current===it? "bg-white/20":"hover:bg-white/10"}`}>
            {it}
          </button>
        ))}
      </nav>
    </aside>
  );
}
