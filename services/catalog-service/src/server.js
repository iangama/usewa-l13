import express from "express";
const app = express();

const products = [
  { id: 1,  name: "Laptop Pro 15\"",     price: 4500, category: "Computadores" },
  { id: 2,  name: "Laptop Air 13\"",     price: 3200, category: "Computadores" },
  { id: 3,  name: "Smartphone X",        price: 2800, category: "Celulares" },
  { id: 4,  name: "Smartphone Lite",     price: 1500, category: "Celulares" },
  { id: 5,  name: "Tablet 10\"",         price: 1800, category: "Tablets" },
  { id: 6,  name: "Monitor 27\"",        price: 1200, category: "Periféricos" },
  { id: 7,  name: "Teclado Mecânico",    price: 350,  category: "Periféricos" },
  { id: 8,  name: "Mouse Gamer",         price: 200,  category: "Periféricos" },
  { id: 9,  name: "Headset Wireless",    price: 600,  category: "Acessórios" },
  { id:10,  name: "Câmera Full HD",      price: 900,  category: "Acessórios" },
  { id:11,  name: "SSD NVMe 1TB",        price: 700,  category: "Armazenamento" },
  { id:12,  name: "HD Externo 2TB",      price: 500,  category: "Armazenamento" },
  { id:13,  name: "Smartwatch Pro",      price: 1100, category: "Wearables" },
  { id:14,  name: "Pulseira Fitness",    price: 300,  category: "Wearables" },
  { id:15,  name: "Impressora WiFi",     price: 900,  category: "Periféricos" }
];

app.get("/catalog/products", (_, res) => res.json(products));

app.listen(4000, () => console.log("catalog-service on 4000"));
