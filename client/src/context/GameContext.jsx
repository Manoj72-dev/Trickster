import { createContext, useContext, useState, useEffect } from 'react'
import { connectSocket } from '../sockets/socket'

const GameContext = createContext()

export function GameProvider({ children }) {
  const [screen, setScreen]         = useState('lobby')
  const [room, setRoom]             = useState(null)
  const [playerName, setPlayerName] = useState('')
  const [myWord, setMyWord]         = useState(null)
  const [error, setError]           = useState(null)

  useEffect(() => {
    const socket = connectSocket()

    socket.on('room-created',  (room) => { setRoom(room); setScreen('lobby') })
    socket.on('room-updated',  (room) => { setRoom(room) })
    socket.on('room-error',    (msg)  => { setError(msg) })

    socket.on('player-kicked', () => {
      setRoom(null)
      setScreen('home')
      setError('You were kicked from the room')
    })

    socket.on('your-word', ({ word, role }) => {
      setMyWord({ word, role })
    })

    socket.on('phase-change', ({ phase, ...rest }) => {
      setScreen(phase)
      setRoom(prev => ({ ...prev, ...rest }))
    })

    socket.on('next-turn', (data) => {
      setRoom(prev => ({ ...prev, currentTurn: data }))
    })

    socket.on('hint-received', ({ name, hint }) => {
      setRoom(prev => ({
        ...prev,
        hints: [...(prev.hints || []), { name, hint }]
      }))
    })

    socket.on('vote-received', ({ voter, votedFor }) => {
      setRoom(prev => ({
        ...prev,
        votes: { ...(prev.votes || {}), [voter]: votedFor }
      }))
    })

    socket.on('round-result', (result) => {
      setScreen('round-result')
      setRoom(prev => ({ ...prev, lastRoundResult: result }))
    })

    socket.on('game-result', (result) => {
      setScreen('game-result')
      setRoom(prev => ({ ...prev, gameResult: result }))
    })

    socket.on('chat-message', (msg) => {
      setRoom(prev => ({
        ...prev,
        messages: [...(prev.messages || []), msg]
      }))
    })

    return () => {
      socket.off('room-created')
      socket.off('room-updated')
      socket.off('room-error')
      socket.off('player-kicked')
      socket.off('your-word')
      socket.off('phase-change')
      socket.off('next-turn')
      socket.off('hint-received')
      socket.off('vote-received')
      socket.off('round-result')
      socket.off('game-result')
      socket.off('chat-message')
    }
  }, [])

  return (
    <GameContext.Provider value={{
      screen, setScreen,
      room,   setRoom,
      playerName, setPlayerName,
      myWord,
      error,  setError,
    }}>
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  return useContext(GameContext)
}