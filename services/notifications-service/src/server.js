import { WebSocketServer } from "ws";
const wss = new WebSocketServer({ port: 4000, path: "/ws" });
wss.on("connection", ws => { ws.send("Welcome to notifications!"); });
console.log("notifications-service on 4000 (path /ws)");
