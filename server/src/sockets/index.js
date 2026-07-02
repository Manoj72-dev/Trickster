const  roomSocket = require('./room.socket')

module.exports = (io) => {
    io.on('connection', (socket) => {

        roomSocket(io ,socket)
        socket.on("disconnect", () => {

        })
        
        
    })
}