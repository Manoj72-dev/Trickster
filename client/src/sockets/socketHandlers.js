import { getSocket } from "./socket";
import { useGameStore } from '../store/gameStore';
import { EVENTS } from './socketEvents'

export function registerSocketHandlers() {
    const socket = getSocket();
    const store = useGameStore.getState();
    socket.off(EVENTS.ROOM_CREATED);
    socket.off(EVENTS.ROOM_JOINED);
    socket.off(EVENTS.ROOM_ERROR);
    socket.off(EVENTS.ROOM_UPDATED);
    socket.off(EVENTS.ROOM_LEFT);
    socket.off(EVENTS.PLAYER_KICKED);
    socket.off(EVENTS.CHAT_MESSAGE)
    socket.off('connect');

    socket.on("connect", () => {
        store.setSocketId(socket.id);
    });
    socket.on(EVENTS.ROOM_CREATED, (room) => {
        store.setLoading(false);
        store.setRoom(room);
        store.setScreen('lobby');
    })
    
    socket.on(EVENTS.ROOM_JOINED, (room) => {
        store.setLoading(false);
        store.setRoom(room)
        store.setScreen('lobby');
    })

    socket.on(EVENTS.ROOM_ERROR, (error) =>{
        console.log(error);
    })

    socket.on(EVENTS.ROOM_UPDATED, (room)=>{
        store.setRoom(room);
        store.setScreen(room.phase)
        console.log(room.phase);
    })

    socket.on(EVENTS.ROOM_LEFT, ()=>{
        store.setScreen('home');
        store.setRoom(null);
        store.setPlayerName('');
    })
    socket.on(EVENTS.PLAYER_KICKED,()=>{
        store.setScreen('home');
        store.setRoom(null);
        store.setPlayerName('');
    })
    socket.on(EVENTS.CHAT_MESSAGE,(mes) =>{
        store.addChatMessage(mes);
    })

    socket.on(EVENTS.GAME_WORD,({word, role})=> {
        store.setPlayerRole({word, role});
        store.setScreen('starting');
    })
}