const { getPublicRoomObject } = require('../models/Room');

const {
    markCompleted, addHint, markVoted,
    getActivePlayers, resolveVotes, eliminatePlayer, checkGameEnd,
    selectWord, selectImposter
} = require('../services/gameService');

const { resetRoom, removePlayer } = require('../services/roomService');
const { EVENTS } = require('../sockets/socketEvents');
const words = require('../store/words');
const { find } = require('../store/words');

const ELIMINATION_SCREEN_DURATION = 6000;

function startGame(io, room){
        
        const { realWord, fakeWord } = selectWord();
        const { imposterId } = selectImposter(room);

        room.imposterId = imposterId;
        room.words.real = realWord;
        room.words.fake = fakeWord;
        room.phase = 'starting';

        for (const player of room.players.values()){
            if(player.id === imposterId){
                io.to(player.id).emit(EVENTS.GAME_STARTING, {word: fakeWord, role: 'imposter'})
            }
            else{
                io.to(player.id).emit(EVENTS.GAME_STARTING, {word: realWord, role: 'player',})
            }
        }

        io.to(room.roomCode).emit(EVENTS.ROOM_UPDATE, getPublicRoomObject(room))
}

function startNewRound(io, room, socketId) {
    if (!markCompleted(room, socketId)) {
        return;
    }
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
            room.timers.endTime = 
                Date.now() + room.settings.voteTime * 1000;

            room.timers.current = setTimeout(() => {
                    endVoting(io, room);
                }, room.settings.voteTime * 1000);
            break
    }
    io.to(room.roomCode).emit(EVENTS.ROOM_UPDATE, getPublicRoomObject(room));
}



function endVoting(io, room){
    const result = resolveVotes(room);
    let eliminatedPlayer = null;

    if (result.eliminated) {
        eliminatedPlayer = eliminatePlayer(room, result.eliminatedPlayerId);
    }

    room.round.hints.clear();        
    room.round.votes.clear();
    
    room.phase = 'elimination';

    io.to(room.roomCode).emit(EVENTS.ROUND_END, {
        eliminated: result.eliminated,
        eliminatedPlayer: eliminatedPlayer,
    });
    io.to(room.roomCode).emit(EVENTS.ROOM_UPDATE, getPublicRoomObject(room))


    const gameEndCheck = checkGameEnd(room);

    room.timers.current = setTimeout(() => {
        if (gameEndCheck.isGameOver) {
            const imposter = [...room.players.values()].find(player => player.id === room.imposterId);
            room.phase = 'ended';
            room.result = {
                winner: gameEndCheck.winner,
                reason: gameEndCheck.reason,
                imposter: imposter,
                words: room.words
            };
            io.to(room.roomCode).emit(EVENTS.GAME_OVER, getPublicRoomObject(room));
            resetRoom(room);
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
    io.to(room.roomCode).emit(EVENTS.VOTE_SUBMITTED, getPublicRoomObject(room));

    const activePlayers = getActivePlayers(room);
    if (room.round.votes.size >= activePlayers.length) {
        clearTimeout(room.timers.current);
        endVoting(io, room);
    }
}


function hintSubmit(io, socketId, room, hint){
    addHint( socketId, room, hint);
    io.to(room.roomCode).emit(EVENTS.HINT_SUBMITTED, getPublicRoomObject(room));

    const activePlayers = getActivePlayers(room);
    if (room.round.hints.size >= activePlayers.length) {
        clearTimeout(room.timers.current);
        changePhase(io, room, 'voting');
    }
}

function returnToHome(io, socket, room){
    const result = removePlayer(room, socket.id);

    if(!result.success){
        sendError(socket, result.message);
        return;
    }
    socket.leave(room.roomCode);
    socket.emit(EVENTS.ROOM_LEFT);
}

function returnToLobby(io, socket, room){
    socket.emit(EVENTS.ROOM_UPDATE, getPublicRoomObject(room))
}

module.exports = { startGame, startNewRound, hintSubmit, voteSubmisision, endVoting, returnToHome, returnToLobby };
