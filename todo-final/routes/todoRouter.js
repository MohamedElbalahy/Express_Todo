// ============================================================
// ROUTER (session-3 topic)
// Responsible for: mapping HTTP methods + paths to controllers.
// Also demonstrates ROUTER-LEVEL middleware.
// ============================================================

import { Router } from "express";
import {
  getAllTodosController,
  getTodoByIdController,
  createTodoController,
  updateTodoController,
  deleteTodoController,
} from "../controllers/todoController.js";

const todoRouter = Router();

// ── ROUTER-LEVEL MIDDLEWARE (session-3 topic) ─────────────
// This middleware runs only for requests that reach THIS router.
// Unlike app-level middleware, it does NOT run for other routers.
todoRouter.use((req, res, next) => {
  console.log(`  → [TodoRouter] hit: ${req.method} ${req.baseUrl}${req.path}`);
  next();
});

// ── ROUTES ───────────────────────────────────────────────
// Each route calls one controller function (the C in MVC).

todoRouter.get("/", getAllTodosController);       // GET    /api/todos
todoRouter.post("/", createTodoController);       // POST   /api/todos
todoRouter.get("/:id", getTodoByIdController);    // GET    /api/todos/:id
todoRouter.put("/:id", updateTodoController);     // PUT    /api/todos/:id
todoRouter.delete("/:id", deleteTodoController);  // DELETE /api/todos/:id

export default todoRouter;
