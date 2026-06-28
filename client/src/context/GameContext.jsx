import { createContext, useContext, useState, useEffect } from 'react'
import { connectSocket } from '../sockets/socket'

import * as LobbyAction from '../game/lobbyActions';

const GameContext = createContext()

export function GameProvider({ children }) {
  const [socketId, setSocketId] = useState(null);
  const [connected, setConnected] = useState(false);

  const [screen, setScreen]         = useState('home')

  const [room, setRoom]             = useState(null)
  const [playerName, setPlayerName] = useState('')
  const [myWord, setMyWord]         = useState(null)

  const [error, setError]           = useState(null)
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const socket = connectSocket()

    socket.on("connect", () => {
      setConnected(true);
      setSocketId(socket.id);
      setError(null);

    })

    socket.on("connect_error", () => {
        setConnected(false);
        setError("Unable to connect to the server.");
    });

    socket.on("disconnect", () => {
    setConnected(false);
    setSocketId(null);
    setRoom(null)
    setPlayerName("")
    setScreen('home');

    });

    socket.on("room-created", (room) => {
      setLoading(false);
      setError(null);

      setRoom(room);
      setScreen("lobby");
    });

    socket.on("room-joined", (room) => {
      setLoading(false);
      setError(null);

      setRoom(room);
      setScreen("lobby");
    });

    socket.on("room-error", (message) => {
      setLoading(false);
      setError(message);
    });

    socket.on("lobby-exit", () =>{
      setScreen("home")
      setRoom(null)
      setPlayerName("")
    })

    socket.on("lobby-updated", ({ room, message }) => {
      setRoom(room);
      console.log(message);
    });

    return () => {
      socket.off("connect");
      socket.off("connect_error");
      socket.off("disconnect");
      socket.off("room-created");
      socket.off("room-joined");
      socket.off("room-error");
      socket.off("lobby-exit");
      socket.off("lobby-updated");
    };
  }, []);

  const createRoom = (playerName) =>
    LobbyAction.createRoom({
      playerName,
      setLoading,
      setError,
    });
  
    const joinRoom = (roomCode, playerName) => 
      LobbyAction.joinRoom({
        roomCode,
        playerName,
        setLoading,
        setError,
      });
  
  const kickPlayer = (roomCode, playerId) => {
    LobbyAction.kickPlayer({
      roomCode,
      playerId,
      setError,
    })
  }

  const leaveLobby = (roomCode) => {
    LobbyAction.leaveLobby({
      roomCode,
      setError
    })
  } 

  const toggleReady = (roomCode) => {
    LobbyAction.toggle({
      roomCode,
      setError,
    })
  }
  return (
    <GameContext.Provider value={{
      room,
      screen, 
      connected,   
      playerName, 
      myWord,
      error,  
      loading, 
      socketId,

      setPlayerName,

      createRoom,
      joinRoom,
      kickPlayer,
      leaveLobby,
      toggleReady,
    }}>
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  return useContext(GameContext)
}