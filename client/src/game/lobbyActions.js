import { getSocket } from "../sockets/socket";
import { EVENTS } from "../constants/events";

export function createRoom({ playerName, setLoading, setError }) {
    const socket = getSocket();

    setLoading(true);
    setError(null);

    socket.emit(EVENTS.ROOM_CREATE, {
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
    socket.emit(EVENTS.ROOM_JOIN, {
        roomCode,
        playerName,
    });
}

export function kickPlayer({roomCode, playerId, setError}){
    const socket = getSocket();

    setError(null);
    socket.emit(EVENTS.PLAYER_KICK, {
        roomCode, playerId
    });
}

export function leaveLobby({roomCode,setError}){
    const socket = getSocket();

    setError(null)
    socket.emit(EVENTS.PLAYER_LEAVE,{
        roomCode
    })
}

export function toggle({roomCode, setError}){
    const socket = getSocket();

    setError(null);
    socket.emit(EVENTS.PLAYER_TOGGLE, {
        roomCode
    })
}
export const changeSetting = ({roomCode, settings}) => {
    const socket = getSocket();
  socket.emit("room-setting-change", {
    roomCode,
    settings,
  });
};