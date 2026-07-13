const { createRoom, changeSettings, joinRoom, removePlayer, togglePlayer, makeHost } = require('../services/roomService');
const { getPublicRoomObject } = require('../models/Room');

const { EVENTS } = require('../sockets/socketEvents')

function sendError(socket, message) {
    socket.emit(EVENTS.ROOM_ERROR, message);
}

function roomCreation(socket, playerName){
    const result = createRoom(socket.id, playerName);
    if(!result.success){
        sendError(socket, result.message);
        return;
    }
    socket.join(result.room.roomCode);
    socket.emit(EVENTS.ROOM_CREATED, 
        getPublicRoomObject(result.room)
    )
}

function roomJoining(io, socket, room, playerName){
    const result = joinRoom(room, socket.id, playerName);

    if(!result.success){
        sendError(socket, result.message);
        return;
    }

    io.to(room.roomCode).emit(EVENTS.CHAT_MESSAGE, {
        type: 'system',
        text: `${playerName.trim()} joined the lobby.`,
    })

    socket.join(room.roomCode);

    socket.emit(EVENTS.ROOM_JOINED,
        getPublicRoomObject(result.room)
    )

    io.to(room.roomCode).emit(EVENTS.ROOM_UPDATE, 
        getPublicRoomObject(result.room)
    )
}

function roomLeave(io, socket, room){
    const result = removePlayer(room, socket.id);

    if(!result.success){
        sendError(socket, result.message);
        return;
    }
    
    socket.leave(room.roomCode);
    socket.emit(EVENTS.ROOM_LEFT);
    
    if (result.deleted) 
        return;

    io.to(room.roomCode).emit(EVENTS.ROOM_UPDATE, getPublicRoomObject(room));
    io.to(room.roomCode).emit(EVENTS.CHAT_MESSAGE, {
        type: 'system',
        text: `${result.player.name} left the lobby.`,
    });
}

function playerToggle(io, socket, room){
    const result = togglePlayer(room ,socket.id);
    if(!result.success){
        sendError(socket, 'Internal server error');
        return;
    }
    io.to(room.roomCode).emit(EVENTS.ROOM_UPDATE, getPublicRoomObject(room));
}

function kickPlayer(io, socket, room, playerId){
    
    const result = removePlayer(room, playerId);

    if(!result.success){
        sendError(socket, result.message);
        return;
    }

    const kickSocket = io.sockets.sockets.get(playerId);
    if (kickSocket) {
        kickSocket.leave(room.roomCode);
    }
    io.to(playerId).emit(EVENTS.PLAYER_KICKED);
        
    if (result.deleted) 
        return;

    io.to(room.roomCode).emit(EVENTS.ROOM_UPDATE, getPublicRoomObject(room));
    io.to(room.roomCode).emit(EVENTS.CHAT_MESSAGE, {
        type: 'system',
        text: `${result.player.name} was kicked.`,
    });
}

function changeRoomSettings(io, room, settings){
    const result = changeSettings( room, settings);
    if(!result.success){
        sendError(socket, result.message);
        return;
    }

    io.to(room.roomCode).emit(EVENTS.ROOM_UPDATE, getPublicRoomObject(room));
}

function makePlayerHost(io,socket, room, playerId){
    const result = makeHost(room, playerId);

    if(!result?.success){
        sendError(socket, result.message);
        return;
    }
    
    io.to(room.roomCode).emit(EVENTS.ROOM_UPDATE, getPublicRoomObject(room));
    io.to(room.roomCode).emit(EVENTS.CHAT_MESSAGE, {
        type: 'system',
        text: `${result.player.name} is now the host.`,
    });
}

function sendMessage(io, room, player, message){
    io.to(room.roomCode).emit(EVENTS.CHAT_MESSAGE, {
            type: 'chat',
            senderId: player.id,
            senderName: player.name,
            text: message.trim(),
        });
}

module.exports = { roomCreation, roomJoining, roomLeave, playerToggle, kickPlayer, changeRoomSettings, makePlayerHost, sendMessage }