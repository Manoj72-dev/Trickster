const { validateJoin, validateCreate, validateLeave, validateSettingsChange, validateToggle, validateCanBe, validateMessage } = require('../managers/validationManager');
const { roomCreation, roomJoining, roomLeave, playerToggle, kickPlayer, changeRoomSettings, makePlayerHost, sendMessage } = require('../managers/roomManager')
const { EVENTS } = require('./socketEvents');
module.exports = (io, socket) => {

    socket.on(EVENTS.ROOM_CREATE, ({ playerName }) => {
        const result = validateCreate(socket, playerName?.trim());
        if(!result.success){
            console.log(result.error);
            return;
        }

        roomCreation(socket, playerName);
    });

    socket.on(EVENTS.ROOM_JOIN, ({ roomCode, playerName }) => {

        const result = validateJoin(socket, roomCode?.trim(), playerName?.trim());

        if(!result.success){
            console.log(result.error);
            return;
        }

        roomJoining(io, socket, result.room, playerName);
    });

    socket.on(EVENTS.ROOM_LEAVE, ({ roomCode }) => {
        const result = validateLeave( socket, roomCode?.trim());

        if(!result.success){
            console.log(result.error);
            return;
        }
        
        roomLeave(io, socket, result.room);
       
    });

    socket.on(EVENTS.ROOM_SETTING_CHANGE, ({ roomCode, settings }) => {
        
        const result = validateSettingsChange(socket, roomCode, settings);
       
        if(!result.success){
            console.log(result.message);
            return;
        }
        changeRoomSettings(io, result.room, settings);
    });

    socket.on(EVENTS.PLAYER_KICK, ({ roomCode, playerId }) => {
        const result = validateCanBe(socket, roomCode, playerId);

        if(!result.success){
            console.log(result.message);
            return;
        }

        kickPlayer(io, socket, result.room, playerId);
        
    });

    socket.on(EVENTS.PLAYER_MAKE_HOST, ({ roomCode, playerId }) => {

        const result = validateCanBe(socket, roomCode, playerId);

        if(!result.success){
            console.log(result.message);
            return;
        }
        makePlayerHost(io, socket, result.room, playerId);
    });

    socket.on(EVENTS.PLAYER_TOGGLE, ({ roomCode }) => {
        const result = validateToggle(socket, roomCode)
        
        if(!result.success){
            console.log(result.message);
            return;
        }

        playerToggle(io, socket, result.room)

    });

    socket.on(EVENTS.CHAT_SEND, ({ roomCode, message }) => {
        const result = validateMessage(socket, roomCode, message)

        if(!result.success){
            console.log(result.message);
            return;
        }

        sendMessage(io, result.room, result.player, message);

        
    });

};