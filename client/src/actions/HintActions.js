import { getSocket } from "../sockets/socket";
import { useGameStore } from "../store/gameStore";
import { EVENTS } from "../sockets/socketEvents";

function emit(event, payload){
    const socket = getSocket();
    if(!socket){
        useGameStore.getState().setError("Unable to connect to the server");
        return;
    }
    socket.emit(event, payload);
}


export function startPhaseCompleted(roomCode){
    emit(EVENTS.START_COMPLETED, {roomCode})
}


export function startHintPhase(roomCode, phase){
    const { setLoading, setError } = useGameStore.getState()
    setLoading(true);
    setError(null);
    emit(EVENTS.PHASE_HINT, {roomCode});
}

export function submitHint(roomCode, hint){
    const { setLoading, setError } = useGameStore.getState()
    setLoading(true);
    setError(null);
    emit(EVENTS.HINT_SUBMIT, {roomCode, hint})
}