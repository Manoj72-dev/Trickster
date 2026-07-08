const { changeSettings } = require('../services/roomService');
const { getPublicRoomObject } = require('../models/Room');


function changeRoomSettings(io, room, settings){
    changeSettings( room, settings);

    io.to(room.roomCode).emit('room:updated', getPublicRoomObject(room));
}

module.exports = { changeRoomSettings }