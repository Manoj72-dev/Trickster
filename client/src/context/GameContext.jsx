import { useEffect } from 'react'
import { connectSocket } from '../sockets/socket'
import { EVENTS } from '../constants/events'
import { GameContext } from './GameContextObject'
import { useGameStore } from '../store/gameStore'

import * as LobbyAction from '../game/lobbyActions';

const gameActions = {
  createRoom: LobbyAction.createRoom,
  joinRoom: LobbyAction.joinRoom,
  kickPlayer: LobbyAction.kickPlayer,
  leaveLobby: LobbyAction.leaveLobby,
  toggleReady: LobbyAction.toggleReady,
  changeSetting: LobbyAction.changeSetting,
  sendChatMessage: LobbyAction.sendChatMessage,
  makeHost: LobbyAction.makeHost,
};

export function GameProvider({ children }) {
  useEffect(() => {
    const socket = connectSocket()

    const setConnectedState = (connected, socketId = null) => {
      const { setConnected, setSocketId } = useGameStore.getState();
      setConnected(connected);
      setSocketId(socketId);
    };

    const resetLobby = (error = null) => {
      const {
        setRoom,
        setScreen,
        setPlayerName,
        setError,
        setLoading,
        clearChatMessages,
      } = useGameStore.getState();

      setLoading(false);
      setRoom(null);
      setPlayerName("");
      clearChatMessages();
      setScreen("home");
      setError(error);
    };

    socket.on("connect", () => {
      const { setError } = useGameStore.getState();
      setConnectedState(true, socket.id);
      setError(null);
    })

    socket.on("connect_error", () => {
      const { setError } = useGameStore.getState();
      setConnectedState(false);
      setError("Unable to connect to the server.");
    });

    socket.on("disconnect", () => {
      setConnectedState(false);
      resetLobby("You got disconnected.");
    });

    socket.on(EVENTS.ROOM_CREATED, (room) => {
      const { setLoading, setError, setRoom, setScreen, clearChatMessages } = useGameStore.getState();
      setLoading(false);
      setError(null);
      clearChatMessages();
      setRoom(room);
      setScreen("lobby");
    });

    socket.on(EVENTS.ROOM_JOINED, (room) => {
      const { setLoading, setError, setRoom, setScreen, clearChatMessages } = useGameStore.getState();
      setLoading(false);
      setError(null);
      clearChatMessages();
      setRoom(room);
      setScreen("lobby");
    });

    socket.on(EVENTS.ROOM_ERROR, (message) => {
      const { setLoading, setError } = useGameStore.getState();
      setLoading(false);
      setError(message);
    });

    socket.on(EVENTS.LOBBY_EXIT, () =>{
      resetLobby();
    })

    socket.on(EVENTS.LOBBY_UPDATED, ({ room }) => {
      useGameStore.getState().setRoom(room);
    });

    socket.on(EVENTS.CHAT_MESSAGE, (message) => {
      useGameStore.getState().addChatMessage(message);
    });

    return () => {
      socket.off("connect");
      socket.off("connect_error");
      socket.off("disconnect");
      socket.off(EVENTS.ROOM_CREATED);
      socket.off(EVENTS.ROOM_JOINED);
      socket.off(EVENTS.ROOM_ERROR);
      socket.off(EVENTS.LOBBY_EXIT);
      socket.off(EVENTS.LOBBY_UPDATED);
      socket.off(EVENTS.CHAT_MESSAGE);
    };

  }, []);

  return (
    <GameContext.Provider value={gameActions}>
      {children}
    </GameContext.Provider>
  )
}
