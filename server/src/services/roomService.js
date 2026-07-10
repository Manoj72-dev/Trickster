const { rooms, connections } = require('../store/rooms');
const generateRoomCode = require('../utils/generateCode');
const { createRoomObject } = require('../models/Room');
const { createPlayerObject } = require('../models/Player');
const { success } = require('../utils/validationResult');

function getRoom(roomCode) {
    return rooms.get(roomCode.toUpperCase()) || null;
}

function getPlayer(roomCode, socketId) {
    const room = rooms.get(roomCode.toUpperCase());
    if (!room) return null;
    const player = room.players.get(socketId);
    if (!player) return null;
    return { player };
}

function createRoom(hostId, hostName) {
    let roomCode;
    do {
        roomCode = generateRoomCode();
    } while (rooms.has(roomCode));

    const room = createRoomObject(roomCode, hostId, hostName);
    rooms.set(roomCode, room);
    connections.set(hostId, { roomCode, playerName: hostName });

    return { success:true, room };
}

function joinRoom(room, socketId, playerName) {

    const player = createPlayerObject(socketId, playerName);

    room.players.set(socketId, player);

    connections.set(socketId, { roomCode: room.roomCode, playerName });

    return { success:true, room };
}

function removePlayer(room, socketId) {
   
    const player = room.players.get(socketId);
    room.players.delete(socketId);
    connections.delete(socketId);

    if (room.players.size === 0) {
        rooms.delete(room.roomCode);
        return { success: true, deleted: true, player };
    }

    if (player.isHost) {
        const nextPlayer = [...room.players.values()][0];
        nextPlayer.isHost = true;
        room.hostId = nextPlayer.id;
    }

    return { success:true, deleted: false, player };
}

function makeHost(room, playerId) {

    const player = room.players.get(playerId);

    const currentHost = room.players.get(room.hostId);

    currentHost.isHost = false;
    player.isHost = true;
    room.hostId = playerId;

    return { success: true, player };
}

function togglePlayer(room, socketId) {

    const player = room.players.get(socketId);

    player.isReady = !player.isReady;

    return { success: true };

}

function changeSettings( room, settings) {
    const {maxPlayers, hintTime, voteTime} = settings;
    room.settings.maxPlayers = maxPlayers;
    room.settings.hintTime = hintTime;
    room.settings.voteTime = voteTime;
    return {success: true}
}

module.exports = { createRoom, joinRoom, removePlayer, getRoom, getPlayer, makeHost, togglePlayer, changeSettings };