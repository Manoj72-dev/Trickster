const { validateJoin, validateCreate, validateLeave, validateSettingsChange, validateCanBe } = require('../managers/validationManager');
const { roomCreation, roomJoining, changeRoomSettings } = require('../managers/roomManager')
const { EVENTS } = require('./socketEvents');
module.exports = (io, socket) => {

    socket.on(EVENTS.ROOM_CREATE, ({ playerName }) => {
        const result = validateCreate(socket, playerName?.trim());
        if(!result.success){
            console.log(result.error);
            return;
        }

        roomCreation(playerName);
    });

    socket.on(EVENTS.ROOM_JOIN, ({ roomCode, playerName }) => {

        const result = validateJoin(socket, roomCode?.trim(), playerName?.trim());

        if(!result.success){
            console.log(result.error);
            return;
        }

        roomJoining(io, socket, result.room, playerName);
    });

    socket.on(EVENTS.ROOM_LEAVE, ({ roomCode }) => {
        const result = validateLeave( socket, roomCode?.trim());

        if(!result.success){
            console.log(result.error);
            return;
        }

        const { room, player, deleted, error } = removePlayer(roomCode.trim(), socket.id);
        if (error) {
            socket.emit('room:error', error);
            return;
        }

        socket.leave(roomCode);
        socket.emit('room:left');
        if (deleted) return;

        io.to(room.roomCode).emit('room:updated', getPublicRoomObject(room));
        io.to(room.roomCode).emit('chat:message', {
            type: 'system',
            text: `${player.name} left the lobby.`,
        });
    });

    socket.on('room:settings', ({ roomCode, settings }) => {
        
        const result = validateSettingsChange(socket, roomCode, settings);

        if(!result.success){
            console.log(result.message);
            return;
        }

        changeRoomSettings(io, result.room, settings);
    });

    socket.on('kick:player', ({ roomCode, playerId }) => {
        const result = validateCanBe(socket, roomCode, playerId);

        if(!result.success){
            console.log(result.message);
            return;
        }

        const { room, player, deleted, error } = removePlayer(roomCode.trim(), playerId);
        if (error) {
            socket.emit('room:error', error);
            return;
        }

        io.to(playerId).emit('room:kicked');
        const kickSocket = io.sockets.sockets.get(playerId);
        if (kickSocket) {
            kickSocket.leave(roomCode);
        }
        if (deleted) return;

        io.to(room.roomCode).emit('room:updated', getPublicRoomObject(room));
        io.to(room.roomCode).emit('chat:message', {
            type: 'system',
            text: `${player.name} was kicked.`,
        });
    });

    socket.on('room:host', ({ roomCode, playerId }) => {
        const result = validateCanBe(socket, roomCode, playerId);

        if(!result.success){
            console.log(result.message);
            return;
        }

        const { room, player, error } = makeHost(roomCode.trim(), playerId);
        if (error) {
            socket.emit('room:error', error);
            return;
        }

        io.to(room.roomCode).emit('room:updated', getPublicRoomObject(room));
        io.to(room.roomCode).emit('chat:message', {
            type: 'system',
            text: `${player.name} is now the host.`,
        });
    });

    socket.on('player:toggle', ({ roomCode }) => {
        if (!roomCode?.trim()) {
            socket.emit('room:error', 'Room code is required.');
            return;
        }

        const { room, error } = togglePlayer(roomCode.trim(), socket.id);
        if (error) {
            socket.emit('room:error', error);
            return;
        }

        io.to(room.roomCode).emit('room:updated', getPublicRoomObject(room));
    });

    socket.on('chat:send', ({ roomCode, message }) => {
        if (!roomCode?.trim()) {
            socket.emit('room:error', 'Room code is required.');
            return;
        }
        if (!message?.trim()) return;

        const {roomResult} = getRoom(roomCode.trim());
        if (!roomResult) return;

        const { room } = roomResult;

        const player = room.players.get(socket.id);
        if (!player) return;

        io.to(room.roomCode).emit('chat:message', {
            type: 'chat',
            senderId: player.id,
            senderName: player.name,
            text: message.trim(),
        });
    });

};