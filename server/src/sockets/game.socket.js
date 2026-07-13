const { startGame, startNewRound, hintSubmit, voteSubmisision, returnToHome, returnToLobby } = require('../managers/gameManager');
const { validateStartGame, validateRound, validateHintSubmission, validateVoteSubmission, validateRequest } = require('../managers/validationManager');

const { EVENTS } = require('./socketEvents');

module.exports = (io, socket) =>{
    socket.on(EVENTS.GAME_START, ({roomCode})=>{
        const result = validateStartGame(socket, roomCode);

        if(!result.success){
            console.log(result.error);
            return;
        }

        startGame(io, result.room);
    })

    socket.on(EVENTS.ROUND_START, ({roomCode})=>{
        const result = validateRound(socket, roomCode);
        if(!result.success){
            console.log(result.error);
            return;
        }

        startNewRound(io, result.room, socket.id)
    })

    socket.on(EVENTS.HINT_SUBMIT, ({roomCode, hint}) => {
        const result = validateHintSubmission(socket, roomCode, hint);
        if(!result.success){
            console.log(result.error);
            return;
        }
        hintSubmit(io, socket.id, result.room, hint);
    })

    socket.on(EVENTS.VOTE_SUBMIT, ({roomCode, playerId}) => {
        
        const result = validateVoteSubmission(socket, roomCode, playerId);

        if(!result.success){
            console.log(result.message);
            return;
        }

        voteSubmisision(io, socket.id, result.room, playerId);
    });

    socket.on(EVENTS.RETURN_HOME, ({roomCode}) => {

    })
    socket.on(EVENTS.RETURN_LOBBY, ({roomCode}) => {
        const result = validateRequest(socket, roomCode);
        if(!result.success){
            console.log(result.message);
            return
        }
        returnToLobby(io, socket, result.room);
    })

    socket.on(EVENTS.RETURN_HOME, ({roomCode})=>{
        const result = validateRequest(socket, roomCode);
        if(!result.success){
            console.log(result.message);
            return
        }
        returnToHome(io, socket, result.room);
    })

}