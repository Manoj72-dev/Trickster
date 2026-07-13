require('dotenv').config();
const http = require("http");
const { Server } = require("socket.io");
const logger      = require('./middleware/logger');
const rateLimiter = require('./middleware/rateLimiter');

const app = require("./app");

const registerSocketHandlers = require("./sockets/index")

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        methods: ["GET", "POST"],
    },
})

io.use(logger);
io.use(rateLimiter);

registerSocketHandlers(io);
const PORT = process.env.PORT || 3001;


server.listen(PORT, () =>{
    console.log("Server running");
})
