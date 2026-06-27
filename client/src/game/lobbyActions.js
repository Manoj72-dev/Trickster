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
    console.log("joining");
    socket.emit("room-join", {
        roomCode,
        playerName,
    });
}