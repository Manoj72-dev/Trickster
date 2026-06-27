import { useEffect } from 'react'
import { connectSocket, disconnectSocket } from './sockets/socket'
import { GameProvider, useGame } from './context/GameContext'

import Home        from './pages/Home'
import Lobby       from './pages/Lobby'


function GameScreens() {
  const { screen } = useGame()
  return (
    <>
      {screen === 'home'         && <Home />}
      {screen === 'lobby'        && <Lobby />}
      
    </>
  )
}

function App() {
  useEffect(() => {
    const socket = connectSocket()
    socket.on('connect',    () => console.log('Connected:', socket.id))
    socket.on('disconnect', () => console.log('Disconnected'))
    return () => {
      socket.off('connect')
      socket.off('disconnect')
      disconnectSocket()
    }
  }, [])

  return (
    <GameProvider>
      <GameScreens />
    </GameProvider>
  )
}

export default App