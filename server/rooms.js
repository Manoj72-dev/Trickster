const rooms = new Map();

function generateRoomCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function createRoom(hostId, hostName) {
    const roomCode = generateRoomCode();

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

    rooms.set(roomCode, room);

    return room;
}

function joinRoom(roomCode, playerId, playerName) {
    const room = rooms.get(roomCode);

    if (!room)
        return { error: "Room not found" };

    if (room.phase !== "lobby")
        return { error: "Game already started" };

    if (room.players.length >= room.settings.maxPlayers)
        return { error: "Room is full" };

    room.players.push({
        id: playerId,
        name: playerName,
        ready: false,
        isHost: false,
    });

    return { room };
}


module.exports = { createRoom, joinRoom, }
