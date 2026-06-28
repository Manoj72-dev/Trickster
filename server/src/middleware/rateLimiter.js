const WINDOW_MS = 1000;  // 1 second window
const MAX_EVENTS = 10;   // max events per window

module.exports = (socket, next) => {
  let count = 0;
  let windowStart = Date.now();

  socket.use(([event], next) => {
    const now = Date.now();
    if (now - windowStart > WINDOW_MS) {
      count = 0;
      windowStart = now;
    }

    count++;

    if (count > MAX_EVENTS) {
      console.warn(`[rate-limit] ${socket.id} exceeded limit on event: ${event}`);
      return next(new Error('Too many requests. Slow down.'));
    }

    next();
  });

  next();
}