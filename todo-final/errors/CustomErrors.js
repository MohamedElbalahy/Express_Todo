// ============================================================
// CUSTOM ERRORS (session-3 topic)
// Why: gives each error a statusCode so the error handler
//      middleware can send the right HTTP status automatically.
// ============================================================

// 404 — resource does not exist
export class CustomNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
    this.name = "NotFoundError";
  }
}

// 400 — bad request / missing required fields
export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
    this.name = "ValidationError";
  }
}
