// src/routes/event.ts
import { Router, RequestHandler } from "express";
import eventBus from "../events/eventBus";
import "../events/handlers"; // импорт нужен, чтобы подписчики были зарегистрированы

export interface User {
  id: string;
  name: string;
}

const router = Router();

/**
 * GET /event/users
 */
const getAllUsersEvent: RequestHandler = (req, res, next) => {
  try {
    eventBus.emit("GET_USERS", (err: Error | null, data?: User[]) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(data);
    });
    return;
  } catch (err) {
    next(err);
  }
};

/**
 * POST /event/users
 * Ожидаем body вида { name: string }
 */
const createUserEvent: RequestHandler = (req, res, next) => {
  try {
    const { name } = req.body as { name?: unknown };

    if (typeof name !== "string" || name.trim() === "") {
      res.status(400).json({ error: "Поле name обязательно и должно быть строкой" });
      return;
    }

    eventBus.emit("CREATE_USER", name, (err: Error | null, newUser?: User) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(201).json(newUser);
    });
    return;
  } catch (err) {
    next(err);
  }
};

/**
 * GET /event/users/:id
 */
const getUserByIdEvent: RequestHandler = (req, res, next) => {
  try {
    const { id } = req.params;
    eventBus.emit("GET_USERS", (err: Error | null, data?: User[]) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      const found = data?.find((u) => u.id === id);
      if (!found) {
        res.status(404).json({ error: "Пользователь не найден" });
        return;
      }
      res.json(found);
    });
    return;
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /event/users/:id
 * Ожидаем body вида { name: string }
 */
const updateUserEvent: RequestHandler = (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body as { name?: unknown };

    if (typeof name !== "string" || name.trim() === "") {
      res.status(400).json({ error: "Поле name обязательно и должно быть строкой" });
      return;
    }

    eventBus.emit("GET_USERS", (err: Error | null, data?: User[]) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      const idx = data!.findIndex((u) => u.id === id);
      if (idx === -1) {
        res.status(404).json({ error: "Пользователь не найден" });
        return;
      }
      data![idx].name = name;
      res.json(data![idx]);
    });
    return;
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /event/users/:id
 */
const deleteUserEvent: RequestHandler = (req, res, next) => {
  try {
    const { id } = req.params;
    eventBus.emit("GET_USERS", (err: Error | null, data?: User[]) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      const idx = data!.findIndex((u) => u.id === id);
      if (idx === -1) {
        res.status(404).json({ error: "Пользователь не найден" });
        return;
      }
      const [deleted] = data!.splice(idx, 1);
      res.json(deleted);
    });
    return;
  } catch (err) {
    next(err);
  }
};

// Привязываем обработчики
router.get("/users", getAllUsersEvent);
router.post("/users", createUserEvent);
router.get("/users/:id", getUserByIdEvent);
router.put("/users/:id", updateUserEvent);
router.delete("/users/:id", deleteUserEvent);

export default router;
