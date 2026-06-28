import { getSocket } from "../sockets/socket";

export function createRoom({ playerName, setLoading, setError }) {
    const socket = getSocket();

    setLoading(true);
    setError(null);

    socket.emit("room-create", {
        playerName,
    });
}

export function joinRoom({
    roomCode,
    playerName,
    setLoading,
    setError,
}) {
    const socket = getSocket();

    setLoading(true);
    setError(null);
    socket.emit("room-join", {
        roomCode,
        playerName,
    });
}

export function kickPlayer({roomCode, playerId, setError}){
    const socket = getSocket();

    setError(null);
    socket.emit("player-kick", {
        roomCode, playerId
    });
}

export function leaveLobby({roomCode,setError}){
    const socket = getSocket();

    setError(null)
    socket.emit("player-leave",{
        roomCode
    })
}

export function toggle({roomCode, setError}){
    const socket = getSocket();

    setError(null);
    socket.emit("player-toggle", {
        roomCode
    })
}