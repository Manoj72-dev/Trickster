const EVENTS = require('../constants/events');
const { getRoom } = require('../services/roomService');
const { rooms, connections } = require("../store/rooms");

module.exports = (io, scoket) => {
    scoket.on(EVENTS.GAME_START, ({roomCode})=>{
        room = getRoom(roomCode);
        room.phase = 'starting';

        io.to(roomCode).emit(EVENTS.PHASE_CHANGE, {room});
    })
}

