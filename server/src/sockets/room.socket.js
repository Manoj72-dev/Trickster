const { createRoom, joinRoom, removePlayer, getRoom, makeHost, togglePlayer, changeSettings } = require('../services/roomService');
const { getPublicRoomObject } = require('../models/Room');

module.exports = (io, socket) => {

    socket.on('room:create', ({ playerName }) => {
        if (!playerName?.trim()) {
            socket.emit('room:error', 'Player name is required.');
            return;
        }

        const { room } = createRoom(socket.id, playerName.trim());
        socket.join(room.roomCode);
        socket.emit('room:created', getPublicRoomObject(room));

    });

    socket.on('room:join', ({ roomCode, playerName }) => {
        if (!playerName?.trim()) {
            socket.emit('room:error', 'Player name is required.');
            return;
        }
        if (!roomCode?.trim()) {
            socket.emit('room:error', 'Room code is required.');
            return;
        }

        const { room, error } = joinRoom(roomCode.trim(), socket.id, playerName.trim());
        if (error) {
            socket.emit('room:error', error);
            return;
        }

        io.to(room.roomCode).emit('chat:message', {
            type: 'system',
            text: `${playerName.trim()} joined the lobby.`,
        });
        socket.join(room.roomCode);
        socket.emit('room:joined', getPublicRoomObject(room));
        io.to(room.roomCode).emit('room:updated', getPublicRoomObject(room));

    });

    socket.on('room:leave', ({ roomCode }) => {
        if (!roomCode?.trim()) {
            socket.emit('room:error', 'Room code is required.');
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
        if (!roomCode?.trim()) {
            socket.emit('room:error', 'Room code is required.');
            return;
        }

        const roomResult = getRoom(roomCode.trim());
        if (!roomResult) {
            socket.emit('room:error', 'Room not found.');
            return;
        }
        if (roomResult.room.hostId !== socket.id) {
            socket.emit('room:error', 'Only the host can change settings.');
            return;
        }

        const { room, error } = changeSettings(roomCode.trim(), settings);
        if (error) {
            socket.emit('room:error', error);
            return;
        }

        io.to(room.roomCode).emit('room:updated', getPublicRoomObject(room));
    });

    socket.on('player:kick', ({ roomCode, playerId }) => {
        if (!roomCode?.trim()) {
            socket.emit('room:error', 'Room code is required.');
            return;
        }

        const roomResult = getRoom(roomCode.trim());
        if (!roomResult) {
            socket.emit('room:error', 'Room not found.');
            return;
        }

        if (roomResult.room.hostId !== socket.id) {
            socket.emit('room:error', 'Only the host can kick players.');
            return;
        }

        if (playerId === socket.id) {
            socket.emit('room:error', 'Host cannot kick themselves.');
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

    socket.on('player:host', ({ roomCode, playerId }) => {
        if (!roomCode?.trim()) {
            socket.emit('room:error', 'Room code is required.');
            return;
        }

        const roomResult = getRoom(roomCode.trim());
        if (!roomResult) {
            socket.emit('room:error', 'Room not found.');
            return;
        }
        if (roomResult.room.hostId !== socket.id) {
            socket.emit('room:error', 'Only the host can transfer host.');
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

        const roomResult = getRoom(roomCode.trim());
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