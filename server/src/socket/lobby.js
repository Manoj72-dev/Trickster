const EVENTS = require("../constants/events");
const {rooms, connections} = require("../store/rooms");
const {
    createRoom,
    joinRoom,
    removePlayer,
    togglePlayer,
} = require("../services/roomService");

module.exports = (io, socket) => {

    socket.on(EVENTS.ROOM_CREATE, ({ playerName }) => {

        if (!playerName?.trim()) {
            socket.emit(
                EVENTS.ROOM_ERROR,
                "Player name is required."
            );

            return;
        }

        const {room} = createRoom(
            socket.id,
            playerName.trim()
        );

        socket.join(room.roomCode);

        io.to(room.roomCode).emit(
            EVENTS.ROOM_CREATED,
            room
        );

    });

    socket.on(EVENTS.ROOM_JOIN, ({ roomCode, playerName }) => {
        if (!roomCode?.trim()) {

            socket.emit(
                EVENTS.ROOM_ERROR,
                "Room code is required."
            );
            return;
        }

        if (!playerName?.trim()) {

            socket.emit(
                EVENTS.ROOM_ERROR,
                "Player name is required."
            );
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
            return;
        }

        socket.join(result.room.roomCode);

        socket.emit(
            EVENTS.ROOM_JOINED,
            result.room
        );

        io.to(roomCode).emit(EVENTS.LOBBY_UPDATED, {
            room: result.room,
            message: `${playerName} join the lobby`
        });
    });

    socket.on(EVENTS.PLAYER_KICK,({ roomCode, playerId}) => {
        const result = removePlayer(roomCode, playerId);

        if (result.error) {
            socket.emit(
                EVENTS.ROOM_ERROR,
                result.error
            );
            return;
        }

        io.to(playerId).emit(EVENTS.LOBBY_EXIT);

        const kickedSocket = io.sockets.sockets.get(playerId);
        if (kickedSocket) kickedSocket.leave(roomCode);

        io.to(roomCode).emit(EVENTS.LOBBY_UPDATED, {
            room: result.room,
            message: `${result.player.name} was kicked`
        });
    });

    socket.on(EVENTS.PLAYER_LEAVE, ({ roomCode}) => {

        const result = removePlayer(roomCode, socket.id);

        if (result.error) {
            socket.emit(
                EVENTS.ROOM_ERROR,
                result.error
            );
            return;
        }
        const room = result.room
        socket.leave(roomCode)
        if(room.players.length === 0){
            rooms.delete(roomCode);
            socket.emit(EVENTS.LOBBY_EXIT);
            return;
        }

        if (result.player.isHost) {
            room.players[0].isHost = true;
        }

        socket.emit(EVENTS.LOBBY_EXIT);

        io.to(roomCode).emit(EVENTS.LOBBY_UPDATED, {
            room,
            message: `${result.player.name} left the room`
        });

    })

    socket.on(EVENTS.PLAYER_TOGGLE,({roomCode}) => {
        const result = togglePlayer(roomCode ,socket.id);

        if (result.error) {
            socket.emit(
                EVENTS.ROOM_ERROR,
                result.error
            );
            return;
        }
        io.to(roomCode).emit(EVENTS.LOBBY_UPDATED, {
            room :result.room
        });
    })

};