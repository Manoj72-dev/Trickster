const { createRoom, changeSettings, joinRoom, removePlayer } = require('../services/roomService');
const { getPublicRoomObject } = require('../models/Room');

const { EVENTS } = require('../sockets/socketEvents')

function sendError(socket, message) {
    socket.emit('room:error', message);
    return fail(message);
}

function roomCreation(socket, playerName){
    const result = createRoom(socket.id, playerName);
    if(!result.success){
        sendError(socket, result.message);
        return;
    }

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
    
    if (result.player == null) 
        return;

    io.to(room.roomCode).emit('room:updated', getPublicRoomObject(room));
    io.to(room.roomCode).emit('chat:message', {
        type: 'system',
        text: `${player.name} left the lobby.`,
    });
}



function changeRoomSettings(io, room, settings){
    changeSettings( room, settings);

    io.to(room.roomCode).emit('room:updated', getPublicRoomObject(room));
}

module.exports = { roomCreation, roomJoining, roomLeave, changeRoomSettings }