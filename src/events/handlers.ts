import eventBus from "./eventBus";

// Тип для пользователя
export interface User {
  id: string;
  name: string;
}

// Хранилище в памяти для event-driven варианта
const users: User[] = [];
let nextId = 1;

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
