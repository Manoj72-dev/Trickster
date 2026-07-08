const { success, fail } = require("../utils/validationResult");
const { validateRoom, validatePlayer, validateHost, validatePhase, validateSettings } = require('../services/validationService')

function sendError(socket, message) {
    socket.emit('room:error', message);
    return fail(message);
}

function validateSettingsChange(socket, roomCode, settings){
    const roomResult = validateRoom(roomCode);
    if(!roomResult.success){
        return sendError(socket, roomResult.message);
    }

    const playerResult = validatePlayer(roomResult.room, socket.id);
    if(!playerResult.success){
        return sendError(socket, playerResult.message);
    }

    const hostresult = validateHost(roomResult.room, socket.id);
    if(!hostresult.success){
        return sendError(socket, hostresult.message);
    }

    const phaseResult = validatePhase(roomResult.room, 'lobby');
    if(!phaseResult.success){
        return sendError(socket, hostresult.message);
    }

    const settingResult = validateSettings(roomResult.room, settings);
    if(!settingResult.success){
        return sendError(socket, settingResult.message);
    }

    return success({
        room: roomResult.room,
    });
}

function validateCanBe(socket, roomCode, playerId){
    const roomResult = validateRoom(roomCode);
    if(!roomResult){
        return sendError(socket, roomResult.message);
    }

    const player1Result = validatePlayer(roomResult.room, socket.id);
    if(!player1Result.success){
        return sendError(socket, player1Result.message);
    }

    const player2Result = validatePlayer(roomResult.room, playerId);
    if(!player2Result.success){
        return sendError(socket, player2Result.message);
    }

    const player1ishost = validateHost(roomResult.room, socket.id);
    if(!player1ishost.success){
        return sendError(socket, player1ishost.message);
    }

    const player2IsHost = validateHost(roomResult.room, playerId);
    if(player2IsHost.success){
        return sendError(socket, 'Action can not be perfomed on host.');
    }

    const phaseResult = validatePhase(roomResult.room, 'lobby');
    if(!phaseResult.success){
        return sendError(socket, phaseResult.message)
    }
    
    return success({
        room: roomResult.room,
    })
}


module.exports = { validateSettingsChange ,validateCanBe}