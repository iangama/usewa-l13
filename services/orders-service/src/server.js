import express from "express";
const app = express();
app.use(express.json());
app.post("/orders", (req, res) => {
  const items = req.body?.items || [];
  res.json({ orderId: Date.now(), items, status: "created" });
});
app.get("/orders/health", (_, res) => res.json({ ok: true }));
app.listen(4000, () => console.log("orders-service on 4000"));
