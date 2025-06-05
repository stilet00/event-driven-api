// src/routes/classic.ts
import { Router, RequestHandler } from "express";
import { mockUsers, User as MockUser } from "../data/mockUsers";

interface User {
  id: string;
  name: string;
}

const users: MockUser[] = mockUsers.map(u => ({ id: u.id, name: u.name }));

let nextId = mockUsers.reduce((max, u) => {
  const num = Number(u.id);
  return isNaN(num) ? max : Math.max(max, num);
}, 0) + 1;

const router = Router();

function heavyStep(stepNumber: number, delay: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Classic: выполнен шаг №${stepNumber}`);
      resolve();
    }, delay);
  });
}

/**
 * GET /classic/users
 */
const getAllUsers: RequestHandler = (req, res, next) => {
  try {
    res.json(users);
    return;
  } catch (err) {
    next(err);
  }
};

/**
 * POST /classic/users
 * Ожидаем body вида { name: string }
 */
const createUser: RequestHandler = async (req, res, next) => {
  try {
    const { name } = req.body as { name?: unknown };

    if (typeof name !== "string" || name.trim() === "") {
      res.status(400).json({ error: "Поле name обязательно и должно быть строкой" });
      return;
    }
    const start = Date.now();
    console.log("Classic: начали создание");
    for (let step = 1; step <= 10; step++) {
      // Здесь delay = 100 мс (можно увеличить или сделать динамическим)
      await heavyStep(step, 100);
    }

    const newUser: User = { id: nextId.toString(), name };
    users.push(newUser);
    nextId++;
    console.log(`Classic: закончили все шаги за ${Date.now() - start} мс`);
    res.status(201).json(newUser);
    return;
  } catch (err) {
    next(err);
  }
};

/**
 * GET /classic/users/:id
 */
const getUserById: RequestHandler = (req, res, next) => {
  try {
    const { id } = req.params;
    const found = users.find((u) => u.id === id);

    if (!found) {
      res.status(404).json({ error: "Пользователь не найден" });
      return;
    }

    res.json(found);
    return;
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /classic/users/:id
 * Ожидаем body вида { name: string }
 */
const updateUser: RequestHandler = (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body as { name?: unknown };

    if (typeof name !== "string" || name.trim() === "") {
      res.status(400).json({ error: "Поле name обязательно и должно быть строкой" });
      return;
    }

    const idx = users.findIndex((u) => u.id === id);
    if (idx === -1) {
      res.status(404).json({ error: "Пользователь не найден" });
      return;
    }

    users[idx].name = name;
    res.json(users[idx]);
    return;
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /classic/users/:id
 */
const deleteUser: RequestHandler = (req, res, next) => {
  try {
    const { id } = req.params;
    const idx = users.findIndex((u) => u.id === id);
    if (idx === -1) {
      res.status(404).json({ error: "Пользователь не найден" });
      return;
    }

    const [deleted] = users.splice(idx, 1);
    res.json(deleted);
    return;
  } catch (err) {
    next(err);
  }
};

// Привязываем все обработчики к роутам
router.get("/users", getAllUsers);
router.post("/users", createUser);
router.get("/users/:id", getUserById);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

export default router;
