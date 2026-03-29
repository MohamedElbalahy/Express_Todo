// ============================================================
// APP.JS — Entry point
// Ties together: middleware → routers → error handler
// ============================================================

import express from "express";
import todoRouter from "./routes/todoRouter.js";
import { logger, requestTimer } from "./middleware/appMiddleware.js";

const app = express();


// ── BUILT-IN MIDDLEWARE ───────────────────────────────────
// Parses incoming JSON request bodies => makes req.body work
app.use(express.json());


// ── APP-LEVEL MIDDLEWARE (session-3 topic) ────────────────
// These run on EVERY request, before any router.
app.use(logger);
app.use(requestTimer);


// ── ROUTERS ───────────────────────────────────────────────
// Mount the todo router at /api/todos
// Any request starting with /api/todos is forwarded here.
app.use("/api/todos", todoRouter);


// ── ERROR HANDLING MIDDLEWARE (session-3 topic) ───────────
// MUST be defined LAST — after all routes and routers.
// Express knows this is an error handler because it has 4 params: (err, req, res, next)
//
// How errors reach here:
//   1. next(err)         → from any controller/middleware
//   2. throw inside sync code (Express 5 catches it automatically)
//
// The err.statusCode comes from our CustomErrors — so each
// error type automatically sends the correct HTTP status.
app.use((err, req, res, next) => {
  console.error(`[ERROR] ${err.name}: ${err.message}`);

  res.status(err.statusCode || 500).json({
    error: {
      name: err.name || "ServerError",
      message: err.message,
    },
  });
});


// ── START SERVER ──────────────────────────────────────────
// process.env.PORT => reads from .env (session-2 topic)
const PORT = process.env.PORT || 3000;

app.listen(PORT, (error) => {
  if (error) throw error;
  console.log(`✅ Todo app running on http://localhost:${PORT}`);
  console.log(`\nAvailable endpoints:`);
  console.log(`  GET    /api/todos`);
  console.log(`  GET    /api/todos/:id`);
  console.log(`  POST   /api/todos`);
  console.log(`  PUT    /api/todos/:id`);
  console.log(`  DELETE /api/todos/:id`);
  console.log(`  GET    /api/todos?search=query  (bonus)`);
});


// ============================================================
// THE 4 USE CASES OF next() — summary (session-3 topic)
// ============================================================
//
// 1. next()
//    → Pass control to the NEXT middleware/route handler in line.
//    → Used in: logger, requestTimer, router-level middleware.
//
// 2. next(err)  where err is an Error object
//    → Skip ALL normal middleware. Go straight to the
//      error handling middleware (the 4-param one at the bottom).
//    → Used in: every controller's catch block.
//
// 3. next('route')
//    → Skip remaining handlers in the CURRENT route,
//      move to the NEXT matching route.
//    → Example use: skip to a fallback route if a condition fails.
//
// 4. next('router')
//    → Skip all remaining middleware in the current Router instance.
//      Control returns to the parent (app-level).
//    → Example use: bail out of a router entirely.
//
// ============================================================
