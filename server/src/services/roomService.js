const { rooms, connections } = require('../store/rooms');
const generateRoomCode = require('../utils/generateCode');
const { createRoomObject } = require('../models/Room');
const { createPlayerObject } = require('../models/Player');

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

    return { room };
}

function joinRoom(roomCode, socketId, playerName) {
    const room = rooms.get(roomCode.toUpperCase());
    if (!room) return { error: 'Room not found.' };

    if (room.phase !== 'lobby') return { error: 'Game already started.' };

    if (room.players.size >= room.settings.maxPlayers) return { error: 'Room is full.' };

    const nameTaken = [...room.players.values()]
        .find(p => p.name.toLowerCase() === playerName.toLowerCase());
    if (nameTaken) return { error: 'Name already taken in this room.' };

    const player = createPlayerObject(socketId, playerName);
    room.players.set(socketId, player);
    connections.set(socketId, { roomCode: room.roomCode, playerName });

    return { room };
}

function removePlayer(roomCode, socketId) {
    const room = rooms.get(roomCode.toUpperCase());
    if (!room) return { error: 'Room not found.' };

    const result = getPlayer(roomCode, socketId);
    if (!result) return { error: 'Player not found.' };
    const { player } = result;

    room.players.delete(socketId);
    connections.delete(socketId);

    if (room.players.size === 0) {
        rooms.delete(roomCode.toUpperCase());
        return { deleted: true, player };
    }

    if (player.isHost) {
        const nextPlayer = [...room.players.values()][0];
        nextPlayer.isHost = true;
        room.hostId = nextPlayer.id;
    }

    return { room, player };
}

function makeHost(roomCode, playerId) {
    const room = rooms.get(roomCode.toUpperCase());
    if (!room) return { error: 'Room not found.' };

    const player = room.players.get(playerId);
    if (!player) return { error: 'Player not found.' };

    const currentHost = room.players.get(room.hostId);
    if (currentHost) currentHost.isHost = false;

    player.isHost = true;
    room.hostId = playerId;

    return { room, player };
}

function togglePlayer(roomCode, socketId) {
    const room = rooms.get(roomCode.toUpperCase());
    if (!room) return { error: 'Room not found.' };

    const player = room.players.get(socketId);
    if (!player) return { error: 'Player not found.' };

    player.isReady = !player.isReady;

    return { room, player };
}

function changeSettings( room, settings) {
    const {maxPlayers, hintTime, voteTime} = settings;
    room.settings.maxPlayers = maxPlayers;
    room.settings.hintTime = hintTime;
    room.settings.voteTime = voteTime;
}

module.exports = { createRoom, joinRoom, removePlayer, getRoom, getPlayer, makeHost, togglePlayer, changeSettings };