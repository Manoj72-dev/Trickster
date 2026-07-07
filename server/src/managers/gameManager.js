const { getPublicRoomObject } = require('../models/Room');
const { markCompleted, addHint } = require('../services/gameService');

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
            room.timers.endTime = 
                Date.now() + room.settings.voteTime * 1000;

            room.timers.current = setTimeout(() => {
                    endVoting(room);
                }, room.settings.voteTime * 1000);
            break
    }
    io.to(room.roomCode).emit('room:updated', getPublicRoomObject(room));
}

function endVoting(room){

}

function hintSubmit(io, socketId, room, hint){
    addHint( socketId, room, hint);
    console.log(room);
    io.to(room.roomCode).emit('room:updated', getPublicRoomObject(room));
}
module.exports = { startPhaseCompleted, hintSubmit};