const LobbyHandlers = require("./lobby")

module.exports = (io) => {
    io.on("connection", (socket) => {
        console.log("connected:" ,socket.id);

        LobbyHandlers(io, socket);

        socket.on("disconnect", (reason) => {
    console.log("Disconnected:", socket.id, "Reason:", reason);
});
    });
};