const {rooms} = require('../store/rooms');
const words = require('../store/words');


function selectWord(){
    const randomIndex = Math.floor(Math.random() * words.length);
    return words[randomIndex];
}

function selectImposter(roomCode){
    const room = rooms.get(roomCode.toUpperCase());
    if (!room) {
        throw new Error("Room not found.");
    }

    const players = [...room.players.values()]
    const randomIndex = Math.floor(Math.random() * players.length);

    return {
        imposterId : players[randomIndex].id
    };
}

function markCompleted(room , socketId){
    room.phaseCompleted.add(socketId);
    return room.phaseCompleted.size === room.players.size   
}

function addHint(socketID, room, hint){
    const player = room.players.get(socketID);
    if (!player) return false;
    if (room.round.hints.has(socketID)) {
        return false;
    }
    room.round.hints.set(socketID, {playerId: socketID, playerName: player.name, hint})
    player.hasSubmittedHint = true
    return true;
}

module.exports = {selectWord , selectImposter, markCompleted, addHint }