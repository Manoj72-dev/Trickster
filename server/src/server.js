const http = require("http");
const { Server } = require("socket.io");

const app = require("./app");

const registerSocketHandlers = require("./socket/registerHandlers")

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        orignal: "http://localhost:5173",
        methods: ["GET", "POST"],
    },
})

registerSocketHandlers(io);

server.listen(3001, () =>{
    console.log("Server running on port 3001");
})