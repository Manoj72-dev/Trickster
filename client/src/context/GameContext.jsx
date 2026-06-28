import { useState, useEffect } from 'react'
import { connectSocket } from '../sockets/socket'
import { EVENTS } from '../constants/events'
import { GameContext } from './GameContextObject'

import * as LobbyAction from '../game/lobbyActions';

export function GameProvider({ children }) {
  const [socketId, setSocketId] = useState(null);
  const [connected, setConnected] = useState(false);

  const [screen, setScreen]         = useState('home')

  const [room, setRoom]             = useState(null)
  const [playerName, setPlayerName] = useState('')
  const [myWord]                    = useState(null)

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

    socket.on(EVENTS.ROOM_CREATED, (room) => {
      setLoading(false);
      setError(null);

      setRoom(room);
      setScreen("lobby");
    });

    socket.on(EVENTS.ROOM_JOINED, (room) => {
      setLoading(false);
      setError(null);

      setRoom(room);
      setScreen("lobby");
    });

    socket.on(EVENTS.ROOM_ERROR, (message) => {
      setLoading(false);
      setError(message);
    });

    socket.on(EVENTS.LOBBY_EXIT, () =>{
      setScreen("home")
      setRoom(null)
      setPlayerName("")
    })

    socket.on(EVENTS.LOBBY_UPDATED, ({ room }) => {
      setRoom(room);
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

  const changeSetting = (roomCode, settings) => {
    LobbyAction.changeSetting({roomCode, settings})
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
      changeSetting,
    }}>
      {children}
    </GameContext.Provider>
  )
}
