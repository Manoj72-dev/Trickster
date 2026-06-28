const LobbyHandlers = require("./lobby")

module.exports = (io) => {
    io.on("connection", (socket) => {

        LobbyHandlers(io, socket);

        socket.on("disconnect", () => {
        });
    });
};