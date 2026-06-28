const { rooms, connections } = require("../store/rooms");
const generateRoomCode = require("../utils/generateRoomCode");

function createRoomObject(roomCode, hostId, hostName) {
  return {
    roomCode,
    hostId,
    phase: 'lobby',
    createdAt: Date.now(),

    settings: {
      maxPlayers: 8,
      hintTime: 60,
      voteTime: 60,
    },

    words: {
      real: null,
      imposter: null,
    },

    players: [
      createPlayer(hostId, hostName, true, false),
    ],

    round: {
      current: 1,
      hints: {},
      votes: {},
      tieOccurred: false,
    },

    timers: {
      hintPhase: null,
      connectionCheck: null,
    },

    result: {
      winner: null,
      imposterId: null,
      imposterName: null,
      realWord: null,
      imposterWord: null,
      eliminatedBy: null,
    },
  };
}


function createPlayer(id, name, isHost = false, isReady = false) {
  return {
    id,
    name,
    isHost,
    isReady,
    isImposter: false,
    word: null,

    isEliminated: false,
    isConnected: true,

    disconnectedAt: null,
    eliminatedReason: null,

    hint: null,
    hasSubmittedHint: false,
    vote: null,
    hasVoted: false,
  };
}

function createRoom(hostId, hostName) {
    let roomCode;

    do {
        roomCode = generateRoomCode();
    } while (rooms.has(roomCode));

    const room = createRoomObject(roomCode, hostId, hostName);
    rooms.set(roomCode, room);
    connections.set(hostId,{roomCode, playerName: hostName});

    return {room};
}

function joinRoom(roomCode, playerId, playerName) {
    roomCode = roomCode.toUpperCase();

    const room = rooms.get(roomCode);

    if (!room) {
        return { error: "Room not found." };
    }

    if (room.phase !== "lobby") {
        return { error: "Game already started." };
    }

    if (room.players.length >= room.settings.maxPlayers) {
        return { error: "Room is full." };
    }

    const nameTaken = room.players.find(p => p.name.toLowerCase() === playerName.toLowerCase());

    if(nameTaken){
        return { error: 'Name already taken in this room.'};
    } 

    const alreadyIn = room.players.find(p => p.id === playerId);
    if (alreadyIn) return { room };

    const player = createPlayer(playerId, playerName);
    room.players.push(player);
    connections.set(playerId, { roomCode, playerName });

    return { room };
}

function removePlayer(roomCode, socketId){
    roomCode = roomCode.toUpperCase();

    const room = rooms.get(roomCode);
    if(!room) return {error: 'Room not found.'};

    const playerIndex = room.players.findIndex(p => p.id === socketId);
    if(playerIndex === -1) return {error: 'Player not found.'};

    const player = room.players[playerIndex];

    room.players.splice(playerIndex, 1);
    connections.delete(socketId);

    if (room.players.length === 0) {
        rooms.delete(roomCode);
        return { room, player, deleted: true };
    }

    if (player.isHost) {
        room.hostId = room.players[0].id;
        room.players[0].isHost = true;
    }

    return { room, player, deleted: false };
}

function togglePlayer(roomCode, socketId){
    roomCode = roomCode.toUpperCase();

    const room = rooms.get(roomCode);
    if(!room) return {error: 'Room not found.'};

    const playerIndex = room.players.findIndex(p => p.id === socketId);
    if(playerIndex === -1) return {error: 'Player not found.'};

    room.players[playerIndex].isReady = !room.players[playerIndex].isReady;

    return { room, };
}

function getRoom(roomCode) {
    if (!roomCode) return null;
    return rooms.get(roomCode.toUpperCase());
}

function isRoomHost(roomCode, socketId) {
    const room = getRoom(roomCode);
    return Boolean(room && room.hostId === socketId);
}

module.exports = {
    createRoom,
    joinRoom,
    removePlayer,
    togglePlayer,
    getRoom,
    isRoomHost,
};
