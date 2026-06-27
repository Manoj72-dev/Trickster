import { GameProvider, useGame } from './context/GameContext'
import Home        from './pages/Home'
import Lobby       from './pages/Lobby'

function GameScreens() {

  const { screen, error } = useGame()
  console.log(error);
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