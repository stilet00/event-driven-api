import { mockUsers, User as MockUser } from "../data/mockUsers";
import eventBus from "./eventBus";

// Тип для пользователя
export interface User {
  id: string;
  name: string;
}

const users: MockUser[] = mockUsers.map(u => ({ id: u.id, name: u.name }));

let nextId = mockUsers.reduce((max, u) => {
  const num = Number(u.id);
  return isNaN(num) ? max : Math.max(max, num);
}, 0) + 1;

function heavyStepEvent(stepNumber: number, delay: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log(`Event-driven: шаг №${stepNumber} выполнен`);
      resolve();
    }, delay);
  });
}

// Обработчик для получения списка пользователей
eventBus.on("GET_USERS", (callback: (err: Error | null, data?: User[]) => void) => {
  // просто возвращаем текущий массив
  callback(null, users);
});

// Обработчик для создания пользователя
eventBus.on(
  "CREATE_USER",
  (name: string, callback: (err: Error | null, newUser?: User) => void) => {
    const newUser: User = { id: nextId.toString(), name };
    users.push(newUser);
    nextId++;
    callback(null, newUser);
  }
);

eventBus.on("HEAVY_CREATE_USER", async (name: string) => {
  console.log("Event-driven: начали тяжёлую цепочку для", name);

  for (let step = 1; step <= 10; step++) {
    await heavyStepEvent(step, 100); // каждый шаг 100 мс
  }

  console.log(`Event-driven: тяжёлая цепочка для "${name}" завершена`);
  // В реальном приложении здесь можно сделать дополнительные действия,
  // например: обновить какой-то статус в БД, уведомить других подписчиков и т. д.
});
