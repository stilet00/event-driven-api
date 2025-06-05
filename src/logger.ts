import { EventEmitter } from "events";

// Тип лог-сообщения
interface LogPayload {
  level: "INFO" | "WARN" | "ERROR" | "DEBUG";
  message: string;
  timestamp: Date;
  context?: string; // Дополнительная метка/контекст (например, имя функции)
}

// Создаём EventEmitter для логов
const loggerBus = new EventEmitter();

// ANSI-коды для раскраски в консоли
const COLORS: Record<string, string> = {
  Reset: "\x1b[0m",
  Bright: "\x1b[1m",
  Dim: "\x1b[2m",
  Underscore: "\x1b[4m",
  Blink: "\x1b[5m",
  Reverse: "\x1b[7m",
  Hidden: "\x1b[8m",

  FgBlack: "\x1b[30m",
  FgRed: "\x1b[31m",
  FgGreen: "\x1b[32m",
  FgYellow: "\x1b[33m",
  FgBlue: "\x1b[34m",
  FgMagenta: "\x1b[35m",
  FgCyan: "\x1b[36m",
  FgWhite: "\x1b[37m",

  BgBlack: "\x1b[40m",
  BgRed: "\x1b[41m",
  BgGreen: "\x1b[42m",
  BgYellow: "\x1b[43m",
  BgBlue: "\x1b[44m",
  BgMagenta: "\x1b[45m",
  BgCyan: "\x1b[46m",
  BgWhite: "\x1b[47m",
};

// Функция для форматирования уровня в цвете
function colorLevel(level: string): string {
  switch (level) {
    case "INFO":
      return `${COLORS.FgGreen}${level}${COLORS.Reset}`;
    case "WARN":
      return `${COLORS.FgYellow}${level}${COLORS.Reset}`;
    case "ERROR":
      return `${COLORS.FgRed}${level}${COLORS.Reset}`;
    case "DEBUG":
      return `${COLORS.FgCyan}${level}${COLORS.Reset}`;
    default:
      return level;
  }
}

// Подписка на событие "LOG" – здесь форматируем и выводим
loggerBus.on("LOG", (payload: LogPayload) => {
  const time = payload.timestamp.toISOString();
  const lvl = colorLevel(payload.level);
  const ctx = payload.context ? `[${payload.context}]` : "";
  // Например: 2025-06-05T12:00:00.000Z INFO [MyModule] — Сообщение
  console.log(`${COLORS.Dim}${time}${COLORS.Reset} ${lvl} ${ctx} — ${payload.message}`);
});

// Экспортируем функцию для эмитации логов
export function log(
  level: "INFO" | "WARN" | "ERROR" | "DEBUG",
  message: string,
  context?: string
): void {
  const payload: LogPayload = {
    level,
    message,
    timestamp: new Date(),
    context,
  };
  loggerBus.emit("LOG", payload);
}

// Можно при желании экспортировать сам EventEmitter,
// если где-то понадобятся low-level подписчики:
// export { loggerBus };
