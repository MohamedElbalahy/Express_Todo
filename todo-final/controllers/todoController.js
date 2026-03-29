// ============================================================
// CONTROLLER (The C in MVC)
// Responsible for: handling the request, talking to the Model,
//                  and sending back the response (the View).
// ============================================================

import {
  getAllTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
  searchTodos,
} from "../fake-db.js";

import { CustomNotFoundError, ValidationError } from "../errors/CustomErrors.js";

// ── Helpers ───────────────────────────────────────────────
// Simulates a slow async DB call (like a real database query)
function simulateAsyncDbCall(fn) {
  return new Promise((resolve) => setTimeout(() => resolve(fn()), 10));
}


// ── GET /api/todos  (+ BONUS: ?search=query) ─────────────
export const getAllTodosController = async (req, res, next) => {
  try {
    const { search } = req.query;

    // HANDLING ASYNC ERRORS (session-3 topic):
    // We wrap async DB calls in try/catch.
    // If they throw, we call next(err) to send the error
    // directly to the error handler middleware.
    const result = await simulateAsyncDbCall(() =>
      search ? searchTodos(search) : getAllTodos()
    );

    res.json(result);
  } catch (err) {
    // next(err) => skips all normal middleware, goes straight
    // to the error handling middleware at the bottom of app.js
    next(err);
  }
};


// ── GET /api/todos/:id ────────────────────────────────────
export const getTodoByIdController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const todo = await simulateAsyncDbCall(() => getTodoById(id));

    if (!todo) {
      // throw a custom error => caught by catch => forwarded to error handler
      throw new CustomNotFoundError(`Todo with id "${id}" not found`);
    }

    res.json(todo);
  } catch (err) {
    next(err);
  }
};


// ── POST /api/todos ───────────────────────────────────────
export const createTodoController = async (req, res, next) => {
  try {
    const { title } = req.body;

    // Validation — title is required
    if (!title) {
      throw new ValidationError("title is required");
    }

    const newTodo = await simulateAsyncDbCall(() => createTodo(title));

    // 201 CREATED — standard status for a successful POST
    res.status(201).json(newTodo);
  } catch (err) {
    next(err);
  }
};


// ── PUT /api/todos/:id (partial update) ───────────────────
export const updateTodoController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, isCompleted } = req.body;

    const updatedTodo = await simulateAsyncDbCall(() =>
      updateTodo(id, { title, isCompleted })
    );

    if (!updatedTodo) {
      throw new CustomNotFoundError(`Todo with id "${id}" not found`);
    }

    res.json(updatedTodo);
  } catch (err) {
    next(err);
  }
};


// ── DELETE /api/todos/:id ─────────────────────────────────
export const deleteTodoController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await simulateAsyncDbCall(() => deleteTodo(id));

    if (!deleted) {
      throw new CustomNotFoundError(`Todo with id "${id}" not found`);
    }

    // 204 No Content — success, nothing to send back
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};
