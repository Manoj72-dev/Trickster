import { getSocket } from '../sockets/socket';
import { EVENTS } from '../sockets/socketEvents';
import { useGameStore } from '../store/gameStore'

function emit(event, payload) {
    const socket = getSocket();

    if (!socket) {
        useGameStore.getState().setError("Unable to connect to the server.");
        return;
    }

    socket.emit(event, payload);
}

export function createRoom(playerName) {
    const { setLoading, clearError } = useGameStore.getState()
    setLoading(true);
    emit(EVENTS.ROOM_CREATE, { playerName });
}

export function joinRoom(roomCode, playerName) {
    const { setLoading, setError } = useGameStore.getState()
    setLoading(true);
    setError(null);
    emit(EVENTS.ROOM_JOIN, { roomCode, playerName });
}

export function kickPlayer(roomCode, playerId){
    const { setError } = useGameStore.getState()
    setError(null);
    emit(EVENTS.PLAYER_KICK, {
        roomCode, playerId
    });
}

export function leaveLobby(roomCode){
    const { setError } = useGameStore.getState()
    setError(null)
    emit(EVENTS.ROOM_LEAVE,{
        roomCode
    })
}

export function toggleReady(roomCode){
    const { setError } = useGameStore.getState()
    setError(null);
    emit(EVENTS.PLAYER_TOGGLE, {
        roomCode
    })
}

export function changeSetting(roomCode, settings) {
  emit(EVENTS.ROOM_SETTING_CHANGE, {
    roomCode,
    settings,
  });
}

export function sendChatMessage(message) {
  const { room } = useGameStore.getState();

  if (!room?.roomCode) return;

  emit(EVENTS.CHAT_SEND, {
    roomCode: room.roomCode,
    message,
  });
}

export function makeHost(roomCode, playerId) {
  console.log('makeHost');
  emit(EVENTS.PLAYER_MAKE_HOST, {
    roomCode,
    playerId,
  });
}

export function startGame(roomCode){
    emit(EVENTS.GAME_START,{
        roomCode,
    });
}
