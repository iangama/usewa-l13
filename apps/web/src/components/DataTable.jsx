import React, { useMemo, useState } from "react";

export default function DataTable({ rows, pageSize=5 }) {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(0);

  const filtered = useMemo(()=>{
    const s = q.toLowerCase();
    return rows.filter(r => JSON.stringify(r).toLowerCase().includes(s));
  }, [rows, q]);

  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = filtered.slice(page*pageSize, page*pageSize+pageSize);

  return (
    <div className="space-y-3">
      <div className="flex justify-between gap-3">
        <input value={q} onChange={e=>{setQ(e.target.value); setPage(0);}}
               placeholder="Buscar..." className="w-full px-3 py-2 rounded-xl bg-white/10 outline-none" />
        <span className="opacity-60 text-sm self-center">{filtered.length} itens</span>
      </div>
      <div className="overflow-auto rounded-xl ring-1 ring-white/10">
        <table className="w-full">
          <thead className="bg-white/5">
            <tr>
              {Object.keys(rows[0]||{id:"id"}).map(h=>(
                <th key={h} className="text-left px-3 py-2 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {current.map((r,i)=>(
              <tr key={i} className="odd:bg-white/0 even:bg-white/5">
                {Object.values(r).map((v,j)=>(
                  <td key={j} className="px-3 py-2">{String(v)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end gap-2">
        <button className="btn" onClick={()=>setPage(p=>Math.max(0, p-1))}>◀</button>
        <span className="opacity-70 text-sm self-center">pág. {page+1} / {pages}</span>
        <button className="btn" onClick={()=>setPage(p=>Math.min(pages-1, p+1))}>▶</button>
      </div>
    </div>
  );
}
