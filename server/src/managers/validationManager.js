const { success, fail } = require("../utils/validationResult");
const { validateRoom, validatePlayer, validateRoomCapacity, validateName, validateHost, validatePhase, validateSettings, validateHasVoted, validateMessageLenght,
    validateStartingCondition, validateHint, validateHasSubmitted
 } = require('../services/validationService')
 
function sendError(socket, message) {
    socket.emit('room:error', message);
    return fail(message);
}

function validateCreate(socket, playerName){
    const nameResult = validateName(playerName);
    if(!nameResult.success){
        return sendError(socket, nameResult.message);
    }
    return success();
}

function validateJoin(socket, roomCode, playerName){
    const roomResult = validateRoom(roomCode);
    if(!roomResult.success){
        return sendError(socket, roomResult.message);
    }

    const nameResult = validateName(playerName, roomResult.room);
    if(!nameResult.success){
        return sendError(socket, nameResult.message);
    }

    const phaseResult = validatePhase(roomResult.room, 'lobby');
    if(!phaseResult.success){
        return sendError(socket, phaseResult.message);
    }

    const result = validateRoomCapacity(roomResult.room);
    if(!result.success){
        return sendError(socket, result.message);
    }

    return success({
        room: roomResult.room
    });
}

function validateLeave(socket, roomCode){
    const roomResult = validateRoom(roomCode);
    if(!roomResult.success){
        return sendError(socket, roomResult.message);
    }

    const playerResult = validatePlayer(roomResult.room, socket.id);
    if(!playerResult.success){
        return sendError(socket, playerResult.message);
    }

    return success({
        room: roomResult.room
    });
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

function validateToggle(socket, roomCode){
    
    const roomResult = validateRoom(roomCode);
    if(!roomResult.success){
        return sendError(socket, roomResult.message);
    }

    const playerResult = validatePlayer(roomResult.room, socket.id);
    if(!playerResult.success){
        return sendError(socket, playerResult.message);
    }

    const phaseResult = validatePhase(roomResult.room, 'lobby');
    if(!phaseResult.success){
        return sendError(socket, hostresult.message);
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

function validateVoteSubmission(socket, roomCode, playerId){
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

    const result = validateHasVoted(player1Result.player);
    if(!result.success){
        return sendError(socket, result.message);
    }
    
    return success({
        room: roomResult.room,
    })
}

function validateMessage(socket, roomCode, message){
    const roomResult = validateRoom(roomCode);
    if(!roomResult){
        return sendError(socket, roomResult.message);
    }

    const playerResult = validatePlayer(roomResult.room, socket.id);
    if(!playerResult.success){
        return sendError(socket, playerResult.message);
    }
    const phaseResult = validatePhase(roomResult.room, 'lobby');
    if(!phaseResult.success){
        return sendError(socket, phaseResult.message)
    }

    const phase2Result = validatePhase(roomResult.room, 'voting');
    if(!phaseResult.success){
        return sendError(socket, phaseResult.message)
    }

    const lengthResult = validateMessageLenght(message);
    if(!lengthResult.success){
        return sendError(socket, lengthResult.message);
    }
    return success({
        room: roomResult.room,
        player: playerResult.player,
    })
}

function validateStartGame(socket, roomCode){
    const roomResult = validateRoom(roomCode);
    if(!roomResult){
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

    const conditionResult = validateStartingCondition(roomResult.room);
    if(!conditionResult.success){
        return sendError(socket, conditionResult.message);
    }

    return success({
        room: roomResult.room
    });
}

function validateRound(socket, roomCode){
    const roomResult = validateRoom(roomCode);
    if(!roomResult.success){
        return sendError(socket, roomResult.message);
    }

    const playerResult = validatePlayer(roomResult.room, socket.id);
    if(!playerResult.success){
        return sendError(socket, playerResult.message);
    }

    return success({
        room: roomResult.room
    });
}

function validateHintSubmission(socket, roomCode, hint){
    const roomResult = validateRoom(roomCode);
    if(!roomResult.success){
        return sendError(socket, roomResult.message);
    }

    const playerResult = validatePlayer(roomResult.room, socket.id);
    if(!playerResult.success){
        return sendError(socket, playerResult.message);
    }

    const submissionResult = validateHasSubmitted(playerResult.player);
    if(!submissionResult.success){
        return sendError(socket, submissionResult.message);
    }

    const hintResult = validateHint(hint);
    if(!hintResult.success){
        return sendError(socket, hintResult.message);
    }

    return success({
        room: roomResult.room
    });
}
module.exports = { validateCreate, validateJoin, validateLeave, validateSettingsChange , validateToggle, validateCanBe, validateVoteSubmission, validateMessage, 
    validateStartGame, validateRound, validateHintSubmission}