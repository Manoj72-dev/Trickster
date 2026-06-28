const EVENTS = require("../constants/events");
const { rooms, connections } = require("../store/rooms");
const {
    createRoom,
    joinRoom,
    removePlayer,
    togglePlayer,
    isRoomHost,
    getRoom,
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

        io.to(result.room.roomCode).emit(EVENTS.LOBBY_UPDATED, {
            room: result.room,
            message: `${playerName} join the lobby`
        });
    });

    socket.on(EVENTS.PLAYER_KICK,({ roomCode, playerId}) => {
        if (!isRoomHost(roomCode, socket.id)) {
            socket.emit(
                EVENTS.ROOM_ERROR,
                "Only the host can kick players."
            );
            return;
        }

        if (playerId === socket.id) {
            socket.emit(
                EVENTS.ROOM_ERROR,
                "Host cannot kick themselves."
            );
            return;
        }

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
        if (kickedSocket) kickedSocket.leave(result.room.roomCode);

        io.to(result.room.roomCode).emit(EVENTS.LOBBY_UPDATED, {
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
        socket.leave(room.roomCode)
        if(result.deleted){
            socket.emit(EVENTS.LOBBY_EXIT);
            return;
        }

        socket.emit(EVENTS.LOBBY_EXIT);

        io.to(room.roomCode).emit(EVENTS.LOBBY_UPDATED, {
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
        io.to(result.room.roomCode).emit(EVENTS.LOBBY_UPDATED, {
            room :result.room
        });
    })

    socket.on("disconnect", () => {
        const connection = connections.get(socket.id);
        if (!connection) return;

        const result = removePlayer(connection.roomCode, socket.id);
        if (result.error || result.deleted) return;

        io.to(result.room.roomCode).emit(EVENTS.LOBBY_UPDATED, {
            room: result.room,
            message: `${result.player.name} disconnected`
        });
    });
    socket.on(EVENTS.ROOM_SETTING_CHANGE, ({ roomCode, settings }) => {
        const room = getRoom(roomCode);
        if (!room) return;

        const player = room.players.find(p => p.id === socket.id);

        if (!player || !player.isHost) {
            return;
        }

        room.settings = settings;
        console.log(room);
        io.to(roomCode).emit(EVENTS.LOBBY_UPDATED, {
            room: room,
            message:`{}`,

        });
    });

};
