const { rooms, connection } = require('../store/rooms')
const { success, fail } = require('../utils/validationResult')


function validateName(playerName){
    name = playerName.trim();
    if(!playerName || name.length <3 || name.length >12){
        return fail('Name must be between 3 and 12 characters long.')
    }
    return success();
}

function validateRoom(roomCode){
    const code = roomCode.toUpperCase();
    if(!code?.trim()){
        return fail('RoomCode is requried');
    }
    if(code.length < 6 || codeode.length > 6){
        return fail('RoomCode should be of 6 charaters');
    }

    const room = rooms.get(code);
    if(!room){
        return fail('Room Not found');
    }
    return success({room}); 
}

function validatePlayer( room, playerId){
    const player = room.players.get(playerId);
    if(!player){
        return fail('Player is not in the room.');
    }
    return success({player});
}



function validateHost( room, playerId){
    if (room.hostId !== playerId) {
        return fail("Only the host can perform this action.");
    }

    return success();
}

function validatePhase(room, phase) {
    if (room.phase !== phase) {
        return fail(`Action can only be performed during the ${phase} phase.`);
    }

    return success();
}

function validateSettings(room, settings) {

    if (!settings || typeof settings !== "object") {
        return fail("Settings are required.");
    }

    const allowedKeys = ["maxPlayers", "hintTime", "voteTime"];

    for (const key of Object.keys(settings)) {
        if (!allowedKeys.includes(key)) {
            return fail(`Invalid setting: ${key}`);
        }
    }

    const { maxPlayers, hintTime, voteTime } = settings;

    if (
        maxPlayers === undefined ||
        hintTime === undefined ||
        voteTime === undefined
    ) {
        return fail("No settings were provided.");
    }

    if (maxPlayers !== undefined) {

        if (!Number.isInteger(maxPlayers)) {
            return fail("Max players must be an integer.");
        }

        if (maxPlayers < 3 || maxPlayers > 8) {
            return fail("Max players must be between 3 and 8.");
        }

        if (maxPlayers < room.players.size) {
            return fail("Max players cannot be less than the current number of players.");
        }
    }

    if (hintTime !== undefined) {

        if (!Number.isInteger(hintTime)) {
            return fail("Hint time must be an integer.");
        }

        if (hintTime < 15 || hintTime > 120) {
            return fail("Hint time must be between 15 and 120 seconds.");
        }
    }

    if (voteTime !== undefined) {

        if (!Number.isInteger(voteTime)) {
            return fail("Vote time must be an integer.");
        }

        if (voteTime < 15 || voteTime > 120) {
            return fail("Vote time must be between 15 and 120 seconds.");
        }
    }

    return success();
}

function validateHasVoted(player){
    if(player.hasVoted){
        return fail('You have already voted.');
    }
    return success();
}

module.exports = { validateRoom, validatePlayer, validateHost, validatePhase, validateSettings, validateHasVoted };