// src/routes/classic.ts
import { Router, RequestHandler } from "express";

interface User {
  id: string;
  name: string;
}

const users: User[] = [];
let nextId = 1;

const router = Router();

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
const createUser: RequestHandler = (req, res, next) => {
  try {
    const { name } = req.body as { name?: unknown };

    if (typeof name !== "string" || name.trim() === "") {
      res.status(400).json({ error: "Поле name обязательно и должно быть строкой" });
      return;
    }

    const newUser: User = { id: nextId.toString(), name };
    users.push(newUser);
    nextId++;

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
