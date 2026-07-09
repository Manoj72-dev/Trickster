const { getPublicRoomObject } = require("../models/Room");
const { getRoom } = require("../services/roomService")
const { selectWord, selectImposter, markCompleted } = require('../services/gameService')

const { startPhaseCompleted, hintSubmit, voteSubmisision } = require('../managers/gameManager');
const { validateVoteSubmission } = require('../managers/validationManager');

module.exports = (io, socket) =>{
    socket.on('game:start', ({roomCode})=>{
        if(!roomCode?.trim()){
            socket.emit('room:error', 'Room code is required.');
            return
        }
        const room = getRoom(roomCode);

        if(!room){
            socket.emit('room:error', 'Room not found.');
            return;
        }

        if( socket.id !== room.hostId){
            socket.emit('room:error', 'Only the host can start the game');
            return;
        }
        if (room.players.size < 3) {
            socket.emit("room:error", "At least 3 players are required.");
            return;
        }
        if([...room.players.values()].some(player => !player.isReady)){
            socket.emit('room:error', 'Not all player are ready');
            return;
        }
        
        const { realWord, fakeWord } = selectWord();
        const { imposterId } = selectImposter(roomCode);
        console.log('starting....');
        room.imposterId = imposterId;
        room.words.real = realWord;
        room.words.fake = fakeWord;
        room.phase = 'starting';

        for (const player of room.players.values()){
            if(player.id === imposterId){
                io.to(player.id).emit('game:word', {word: fakeWord, role: 'imposter'})
            }
            else{
                io.to(player.id).emit('game:word', {word: realWord, role: 'player',})
            }
        }

        io.to(roomCode).emit('room:updated', getPublicRoomObject(room))
    
    })

    socket.on('start:completed', ({roomCode})=>{
        if(!roomCode?.trim()){
            socket.emit('room:error', 'Room code is required.');
            return
        }
        const room = getRoom(roomCode);

        if(!room){
            socket.emit('room:error', 'Room not found.');
            return;
        }

        startPhaseCompleted(io, room, socket.id)

    })

    socket.on('hint:submit', ({roomCode, hint}) => {
        if(!roomCode?.trim()){
            socket.emit('room:error', 'Room code is required.');
            console.log("error")
            return
        }
        const room = getRoom(roomCode);

        if(!room){
            socket.emit('room:error', 'Room not found.');
            return;
        }
        hintSubmit(io, socket.id, room, hint);
    })

    socket.on('vote:submit', ({roomCode, playerId}) => {
        
        const result = validateVoteSubmission(socket, roomCode, playerId);

        if(!result.success){
            console.log(result.message);
            return;
        }

        voteSubmisision(io, socket.id, result.room, playerId);
    });
}