// src/server.ts
import express, { Application } from "express";
import classicRouter from "./routes/classic";
import eventRouter from "./routes/event"

const app: Application = express();

// Средство для разбора JSON-body
app.use(express.json());

// Префиксы для разных подходов
app.use("/classic", classicRouter);
app.use("/event", eventRouter);

// Старт сервера
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Classic REST at http://localhost:${PORT}/classic`);
  console.log(`🚀 Event-driven REST at http://localhost:${PORT}/event`);
});
