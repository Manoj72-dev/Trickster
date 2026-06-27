const EVENTS = require("../constants/events");
const rooms = require("../store/rooms");
const {
    createRoom,
    joinRoom,
} = require("../services/roomService");

module.exports = (io, socket) => {

    socket.on(EVENTS.CREATE_ROOM, ({ playerName }) => {

        if (!playerName?.trim()) {
            socket.emit(
                EVENTS.ROOM_ERROR,
                "Player name is required."
            );

            return;
        }

        const room = createRoom(
            socket.id,
            playerName.trim()
        );

        socket.join(room.roomCode);

        io.to(room.roomCode).emit(
            EVENTS.ROOM_CREATED,
            room
        );
                console.log("roomCreated")

    });

    socket.on(EVENTS.JOIN_ROOM, ({ roomCode, playerName }) => {
        if (!roomCode?.trim()) {

            socket.emit(
                EVENTS.ROOM_ERROR,
                "Room code is required."
            );
            console.log("error1");
            return;
        }

        if (!playerName?.trim()) {

            socket.emit(
                EVENTS.ROOM_ERROR,
                "Player name is required."
            );
            console.log("error2");
            return;
        }

        const result = joinRoom(
            roomCode,
            socket.id,
            playerName.trim()
        );

        if (result.error) {

            socket.emit(
                EVENTS.ROOM_ERROR,
                result.error
            );
            console.log("error3");
            return;
        }

        socket.join(result.room.roomCode);

        io.emit(
            EVENTS.ROOM_JOINED,
            result.room
        );

        io.to(result.roomCode).emit(
            EVENTS.PLAYER_JOIN,
            result.room
        );
    });
            

};