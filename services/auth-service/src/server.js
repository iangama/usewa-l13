import express from "express";
import jwt from "jsonwebtoken";
const app = express();
app.use(express.json());
app.post("/auth/login", (req, res) => {
  const { email = "test@test.com" } = req.body || {};
  const token = jwt.sign({ email }, process.env.JWT_SECRET || "secret", { expiresIn: "1h" });
  res.json({ token });
});
app.get("/auth/health", (_, res) => res.json({ ok: true }));
app.listen(4000, () => console.log("auth-service on 4000"));
