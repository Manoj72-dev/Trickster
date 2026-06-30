const LobbyHandlers = require("./lobby")
const gameEngine = require("../game/gameEngine")
module.exports = (io) => {
    io.on("connection", (socket) => {

        LobbyHandlers(io, socket);
        gameEngine(io, socket);
        socket.on("disconnect", () => {
        });
    });
};