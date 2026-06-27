const rooms = require("../store/rooms");
const generateRoomCode = require("../utils/generateRoomCode");

function createRoom(hostId, hostName) {
    let roomCode;

    do {
        roomCode = generateRoomCode();
    } while (rooms[roomCode]);

    const room = {
        roomCode,
        hostId,
        phase: "lobby",

        settings: {
            maxPlayers: 8,
            rounds: 5,
            timer: 60,
            category: "Mixed",
        },

        players: [
            {
                id: hostId,
                name: hostName,
                ready: false,
                isHost: true,
            },
        ],
    };

    rooms[roomCode] = room;

    return room;
}

function joinRoom(roomCode, playerId, playerName) {

    roomCode = roomCode.toUpperCase();

    const room = rooms[roomCode];

    if (!room) {
        return { error: "Room not found." };
    }

    if (room.phase !== "lobby") {
        return { error: "Game already started." };
    }

    if (room.players.length >= room.settings.maxPlayers) {
        return { error: "Room is full." };
    }

    const exists = room.players.find(
        player => player.id === playerId
    );

    if (exists) {
        return { room };
    }

    room.players.push({
        id: playerId,
        name: playerName,
        ready: false,
        isHost: false,
    });

    return { room };
}

module.exports = {
    createRoom,
    joinRoom,
};