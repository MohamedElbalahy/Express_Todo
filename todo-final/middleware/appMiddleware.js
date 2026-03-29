// ============================================================
// APP-LEVEL MIDDLEWARE (session-3 topic)
// These run on EVERY request before it reaches any router.
// ============================================================

// 1. Logger middleware — logs method + URL for every request
export const logger = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next(); // pass control to the next middleware
};

// 2. Request timer middleware — attaches a timestamp to req
//    so controllers can use it if needed
export const requestTimer = (req, res, next) => {
  req.startTime = Date.now();
  next();
};
