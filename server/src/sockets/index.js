const  roomSocket = require('./room.socket')
const gameSocket = require('./game.socket')
module.exports = (io) => {
    io.on('connection', (socket) => {

        roomSocket(io ,socket)
        gameSocket(io, socket)
        socket.on("disconnect", () => {

        })
        
        
    })
}