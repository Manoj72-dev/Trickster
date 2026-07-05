module.exports = (socket, next) => {
    console.log(`[connect] ${socket.id} — ${new Date().toISOString()}`);

    socket.use(([event, ...args], next) => {
        console.log(`[event] ${socket.id} → ${event}`, args[0] ?? '');
        next();
    });

    socket.on('disconnect', (reason) => {
        console.log(`[disconnect] ${socket.id} — reason: ${reason}`);
    });

    next();
}