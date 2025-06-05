import express, { Application } from "express";
import classicRouter from "./routes/classic";
import eventRouter from "./routes/event"
import { log } from "./logger";

const app: Application = express();

// Средство для разбора JSON-body
app.use(express.json());

// Префиксы для разных подходов
app.use("/classic", classicRouter);
app.use("/event", eventRouter);

// Старт сервера
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  log("INFO", `🚀 Classic REST at http://localhost:${PORT}/classic`);
  log("INFO", `🚀 Event-driven REST at http://localhost:${PORT}/event`);
});
