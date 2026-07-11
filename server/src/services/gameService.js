const {rooms} = require('../store/rooms');
const words = require('../store/words');


function selectWord(){
    const randomIndex = Math.floor(Math.random() * words.length);
    return words[randomIndex];
}

function selectImposter(room){

    const players = [...room.players.values()]
    const randomIndex = Math.floor(Math.random() * players.length);

    return {
        imposterId : players[randomIndex].id
    };
}

function markCompleted(room , socketId){
    room.phaseCompleted.add(socketId);
    if(room.phaseCompleted.size === getActivePlayers(room).length ){
        if(room.timers.current)
            clearTimeout(room.timers?.current);
        return true;
    }
    return false
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

function markVoted(socketId, room, playerId){
    const player = room.players.get(socketId);
    if(!player) return false;
    if(room.round.votes.has(socketId)){
        return false;
    }
    room.round.votes.set(socketId, {votedPlayer: playerId});
    player.hasVoted = true
    return true;
}

function getActivePlayers(room) {
    return [...room.players.values()].filter(p => !p.isEliminated && p.isConnected);
}

function resolveVotes(room) {
    const activePlayers = getActivePlayers(room);
    const voteCounts = new Map(); // targetPlayerId -> count

    for (const { votedPlayer } of room.round.votes.values()) {
        if (!votedPlayer) continue; // skip vote
        voteCounts.set(votedPlayer, (voteCounts.get(votedPlayer) || 0) + 1);
    }

    if (voteCounts.size === 0) {
        return { eliminated: false, reason: 'no_votes', voteCounts };
    }

    const maxVotes = Math.max(...voteCounts.values());
    const topCandidates = [...voteCounts.entries()]
        .filter(([, count]) => count === maxVotes)
        .map(([id]) => id);

    if (topCandidates.length > 1) {
        return { eliminated: false, reason: 'tie', maxVotes, voteCounts };
    }

    const threshold = activePlayers.length / 2;
    if (maxVotes < threshold) {
        return { eliminated: false, reason: 'insufficient_majority', maxVotes, voteCounts };
    }

    return {
        eliminated: true,
        eliminatedPlayerId: topCandidates[0],
        maxVotes,
        voteCounts,
    };
}

function eliminatePlayer(room, playerId, reason = 'voted_out') {
    const player = room.players.get(playerId);
    if (!player) return null;
    player.isEliminated = true;
    player.eliminatedReason = reason;
    return player;
}

function checkGameEnd(room) {
    const activePlayers = getActivePlayers(room);

    const imposterActive = activePlayers.some(p => p.id === room.imposterId);
    if (!imposterActive) {
        return { isGameOver: true, winner: 'crew', reason: 'imposter_eliminated' };
    }

    if (activePlayers.length <= 2) {
        return { isGameOver: true, winner: 'imposter', reason: 'two_players_left' };
    }

    return { isGameOver: false };
}

module.exports = {
    selectWord, selectImposter, markCompleted, addHint, markVoted,
    getActivePlayers, resolveVotes, eliminatePlayer, checkGameEnd,
};
