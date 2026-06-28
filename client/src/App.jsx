import { GameProvider } from './context/GameContext'
import { useGame } from './hooks/useGame'
import Home        from './pages/Home'
import Lobby       from './pages/Lobby'
import GameSetting from './components/GameSetting'
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
