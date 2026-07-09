const { getPublicRoomObject } = require('../models/Room');

const {
    markCompleted, addHint, markVoted,
    getActivePlayers, resolveVotes, eliminatePlayer, checkGameEnd,
} = require('../services/gameService');

const ELIMINATION_SCREEN_DURATION = 5000;

function startPhaseCompleted(io, room, socketId) {
    console.log('not all player are ready')
    if (!markCompleted(room, socketId)) {
        return;
    }
    console.log('all are ready')
    changePhase(io, room, "hint");
}

function changePhase(io, room, phase){
    room.phaseCompleted?.clear();
    clearTimeout(room.timers?.current);

    room.phase = phase;

    switch (phase) {
        case 'hint':
            room.timers.endTime = 
                Date.now() + room.settings.hintTime * 1000;
            
            room.timers.current = setTimeout(() => {
                    changePhase(io, room, 'voting');
                }, room.settings.hintTime * 1000);
            break;
        
        case 'voting': 
                console.log('enter voting');
            room.timers.endTime = 
                Date.now() + room.settings.voteTime * 1000;

            room.timers.current = setTimeout(() => {
                    console.log('ending voting');
                    endVoting(io, room);
                }, room.settings.voteTime * 1000);
            break
    }
    io.to(room.roomCode).emit('room:updated', getPublicRoomObject(room));
}



function endVoting(io, room){
    console.log('enter here');
    const result = resolveVotes(room);
    let eliminatedPlayer = null;
    console.log('voteResolved');
    if (result.eliminated) {
        eliminatedPlayer = eliminatePlayer(room, result.eliminatedPlayerId);
    }
    console.log('player eleminated');
    room.round.hints.clear();        
    room.round.votes.clear();
    
    room.phase = 'elimination';
    console.log('sending elinimation');
    io.to(room.roomCode).emit('elimination:result', {
        eliminated: result.eliminated,
        eliminatedPlayer: eliminatedPlayer
            ? { id: eliminatedPlayer.id, name: eliminatedPlayer.name }
            : null,
        reason: result.reason || null,
        voteCounts: Object.fromEntries(result.voteCounts),
    });

    const gameEndCheck = checkGameEnd(room);

    room.timers.current = setTimeout(() => {
        if (gameEndCheck.isGameOver) {
            room.phase = 'ended';
            room.result = {
                winner: gameEndCheck.winner,
                reason: gameEndCheck.reason,
                imposterId: room.imposterId,
            };
            io.to(room.roomCode).emit('game:end', room.result);
        } else {
            room.round.current += 1;
            room.round.hints.clear();
            room.round.votes.clear();
            for (const p of room.players.values()) {
                p.hasSubmittedHint = false;
                p.hasVoted = false;
            }
            changePhase(io, room, 'hint');
        }
    }, ELIMINATION_SCREEN_DURATION);
}

function voteSubmisision(io, socketId, room, playerId){
    markVoted(socketId, room, playerId);
    io.to(room.roomCode).emit('room:updated', getPublicRoomObject(room));

    const activePlayers = getActivePlayers(room);
    if (room.round.votes.size >= activePlayers.length) {
        console.log('[vote check] triggering endVoting');
        clearTimeout(room.timers.current);
        endVoting(io, room);
    }
}


function hintSubmit(io, socketId, room, hint){
    addHint( socketId, room, hint);
    io.to(room.roomCode).emit('room:updated', getPublicRoomObject(room));
}

module.exports = { startPhaseCompleted, hintSubmit, voteSubmisision, endVoting };
