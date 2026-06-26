const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const cors = require('cors')
const { createRoom, joinRoom} = require('./rooms')

const app = express()
app.use(cors())

const server = http.createServer(app)
const io = new Server(server, {
  cors: { origin: 'http://localhost:5173', methods: ['GET', 'POST'] }
})

io.on('connection', (socket) => {
  console.log('Connected:', socket.id)
  
  socket.on("create-room", ({ playerName }) => {

        const room = createRoom(socket.id, playerName);

        socket.join(room.roomCode);

        socket.emit("room-created", room);

        io.to(room.roomCode).emit("room-updated", room);

    });


    socket.on("join-room", ({ roomCode, playerName }) => {

        const result = joinRoom(
            roomCode,
            socket.id,
            playerName
        );

        if (result.error) {

            socket.emit("room-error", result.error);

            return;
        }

        socket.join(roomCode);

        io.to(roomCode).emit(
            "room-updated",
            result.room
        );

    });
  socket.on('disconnect', () => {
    
    console.log('Disconnected:', socket.id)
  })
})

server.listen(3001, () => console.log('Server running on http://localhost:3001'))