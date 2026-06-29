import { GameProvider } from './context/GameContext'
import { useGame } from './hooks/useGame'
import Home        from './pages/Home'
import Lobby       from './pages/Lobby'

function GameScreens() {

  const { screen } = useGame()
  return (
    <>
      {screen === 'home'    && <Home />}
      {screen === 'lobby'    && <Lobby />}
      
    </>
  )
}

function App() {
  return (
    <GameProvider>
      <GameScreens />
    </GameProvider>
  )
}

export default App
