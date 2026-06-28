const http = require("http");
const { Server } = require("socket.io");
const logger      = require('./middleware/logger');
const rateLimiter = require('./middleware/rateLimiter');

const app = require("./app");

const registerSocketHandlers = require("./socket/registerHandlers")

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
    },
})

io.use(logger);
io.use(rateLimiter);

registerSocketHandlers(io);

server.listen(3001, () =>{
    console.log("Server running on port 3001");
})
