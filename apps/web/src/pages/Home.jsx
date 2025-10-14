import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend } from "chart.js";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Modal from "../components/Modal";
import Toast from "../components/Toast";
import DataTable from "../components/DataTable";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

function wsURL() {
  const { protocol, host } = window.location;
  const scheme = protocol === "https:" ? "wss" : "ws";
  return `${scheme}://${host}/ws`;
}

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [tab, setTab] = useState("Dashboard");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [orderItem, setOrderItem] = useState({ id: 1, qty: 1 });
  const [toast, setToast] = useState({ show:false, msg:"" });

  // Live status
  const [authOk, setAuthOk] = useState(null);
  const [ordersOk, setOrdersOk] = useState(null);
  const [catalogCount, setCatalogCount] = useState(null);
  const [wsStatus, setWsStatus] = useState("desconectado");
  const wsRef = useRef(null);

  // Load catalog + live healths
  useEffect(() => {
    fetch("/catalog/products").then(r => r.json()).then((arr) => {
      setProducts(arr);
      setCatalogCount(Array.isArray(arr) ? arr.length : 0);
    }).catch(()=>setCatalogCount(0));

    fetch("/auth/health").then(r=>r.ok?r.json():Promise.reject()).then(()=>setAuthOk(true)).catch(()=>setAuthOk(false));
    fetch("/orders/health").then(r=>r.ok?r.json():Promise.reject()).then(()=>setOrdersOk(true)).catch(()=>setOrdersOk(false));
  }, []);

  // WebSocket status
  useEffect(() => {
    const ws = new WebSocket(wsURL());
    wsRef.current = ws;
    setWsStatus("conectando…");
    ws.onopen = () => setWsStatus("conectado");
    ws.onclose = () => setWsStatus("desconectado");
    ws.onerror = () => setWsStatus("erro");
    ws.onmessage = (ev) => {
      // noop, painel em "Notificações"
    };
    return () => ws.close();
  }, []);

  const chartData = useMemo(()=>({
    labels: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug"],
    datasets: [{ label: "Visitors", data: [3,7,4,9,6,10,8,12] }]
  }),[]);

  async function createOrder() {
    try {
      const res = await fetch("/orders", {
        method:"POST",
        headers: { "Content-Type":"application/json" },
        body: JSON.stringify({ items:[orderItem] })
      });
      const data = await res.json();
      setOrders(o => [data, ...o].slice(0,50));
      setToast({ show:true, msg:`Pedido #${data.orderId} criado` });
      setModalOpen(false);
    } catch {
      setToast({ show:true, msg:"Falha ao criar pedido" });
    }
  }

  const Badge = ({ ok }) => (
    <span className={`px-2 py-0.5 rounded-full text-xs ${ok===true?"bg-green-500/20 text-green-300":ok===false?"bg-red-500/20 text-red-300":"bg-white/10 text-zinc-300"}`}>
      {ok===true?"ok":ok===false?"falha":"—"}
    </span>
  );

  return (
    <div>
      <Navbar onToggleSidebar={()=>setSidebarOpen(v=>!v)} />
      <Sidebar open={sidebarOpen} current={tab} setCurrent={setTab} />

      <main className={`transition-all ${sidebarOpen ? "ml-64" : "ml-0"} mt-14 p-6 space-y-6`}>
        {/* Hero / Chart */}
        <motion.div initial={{ y:-10, opacity:0 }} animate={{ y:0, opacity:1 }} className="card">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">usewa — L13</h1>
              <p className="mt-1 opacity-80">Traefik SAFE: HTTP :8880, HTTPS :8443 (sem 80/443).</p>
            </div>
            <div className="text-sm opacity-70">
              <div>Frontend: React + Vite + Tailwind + Motion + Chart.js</div>
              <div>Microserviços: auth · catalog · orders · notifications</div>
            </div>
          </div>
          <div className="mt-4"><Line data={chartData} /></div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2">
          {["Dashboard","Catálogo","Pedidos","Notificações"].map(t => (
            <button key={t} onClick={()=>setTab(t)}
              className={`btn ${tab===t?"ring-2 ring-white/20":""}`}>{t}</button>
          ))}
          {tab==="Pedidos" && (
            <button className="btn ml-auto" onClick={()=>setModalOpen(true)}>+ Novo pedido</button>
          )}
        </div>

        {/* DASHBOARD — Resumo avançado */}
        {tab==="Dashboard" && (
          <section className="grid lg:grid-cols-3 gap-6">
            {/* Status de serviços */}
            <div className="card">
              <h3 className="font-semibold mb-3">Status dos serviços</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between"><span>auth</span><Badge ok={authOk} /></li>
                <li className="flex justify-between"><span>orders</span><Badge ok={ordersOk} /></li>
                <li className="flex justify-between"><span>catalog</span><span className="px-2 py-0.5 rounded-full text-xs bg-white/10">{catalogCount ?? "…" } itens</span></li>
                <li className="flex justify-between"><span>notifications (ws)</span><span className="px-2 py-0.5 rounded-full text-xs bg-white/10">{wsStatus}</span></li>
              </ul>
            </div>

            {/* Entrypoints e Rotas */}
            <div className="card">
              <h3 className="font-semibold mb-3">Roteamento Traefik (SAFE)</h3>
              <div className="text-sm space-y-2">
                <div className="opacity-80">Entrypoints: <span className="px-2 py-0.5 rounded-full bg-white/10">:8880</span> <span className="px-2 py-0.5 rounded-full bg-white/10">:8443</span></div>
                <div className="flex flex-wrap gap-2">
                  {["/ (web)","/auth","/catalog","/orders","/ws"].map(x=>(
                    <span key={x} className="px-2 py-0.5 rounded-full bg-white/10 text-xs">{x}</span>
                  ))}
                </div>
                <div className="opacity-60 text-xs mt-2">Dashboard dev: :8081 (recomenda-se desligar em produção)</div>
              </div>
            </div>

            {/* Ações rápidas */}
            <div className="card">
              <h3 className="font-semibold mb-3">Ações rápidas</h3>
              <div className="flex flex-wrap gap-2">
                <a className="btn" href="/catalog/products" target="_blank" rel="noreferrer">GET /catalog/products</a>
                <a className="btn" href="/auth/health" target="_blank" rel="noreferrer">GET /auth/health</a>
                <button className="btn" onClick={()=>setModalOpen(true)}>POST /orders</button>
              </div>
            </div>
          </section>
        )}

        {/* CATÁLOGO */}
        {tab==="Catálogo" && (
          <section className="card">
            <h2 className="text-xl font-semibold mb-3">Produtos</h2>
            <DataTable rows={products} />
          </section>
        )}

        {/* PEDIDOS */}
        {tab==="Pedidos" && (
          <section className="card space-y-4">
            <h2 className="text-xl font-semibold">Pedidos recentes</h2>
            <DataTable rows={orders.length?orders:[{orderId:"—", status:"—"}]} />
          </section>
        )}

        {/* NOTIFICAÇÕES */}
        {tab==="Notificações" && (
          <section className="card">
            <h2 className="text-xl font-semibold mb-3">WebSocket (/ws)</h2>
            <p className="opacity-70 text-sm mb-3">Status: <span className="px-2 py-0.5 rounded-full bg-white/10">{wsStatus}</span></p>
            <p className="opacity-70 text-sm">Abra o console/Network para inspecionar eventos. O servidor envia uma mensagem de boas-vindas no connect.</p>
          </section>
        )}
      </main>

      <Modal open={modalOpen} title="Novo pedido"
             onClose={()=>setModalOpen(false)}
             onConfirm={createOrder} confirmText="Criar">
        <div className="grid grid-cols-2 gap-3">
          <label className="text-sm opacity-70">ID do item
            <input type="number" className="w-full mt-1 px-3 py-2 rounded-xl bg-white/10 outline-none"
              value={orderItem.id} onChange={e=>setOrderItem(o=>({...o, id:+e.target.value||1}))} />
          </label>
          <label className="text-sm opacity-70">Quantidade
            <input type="number" className="w-full mt-1 px-3 py-2 rounded-xl bg-white/10 outline-none"
              value={orderItem.qty} onChange={e=>setOrderItem(o=>({...o, qty:+e.target.value||1}))} />
          </label>
        </div>
      </Modal>

      <Toast message={toast.msg} show={toast.show} onHide={()=>setToast({show:false,msg:""})} />
    </div>
  );
}
