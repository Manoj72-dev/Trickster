import { GameProvider } from './context/GameContext'
import { useGame } from './hooks/useGame'
import { AnimatePresence } from 'framer-motion'

import Home        from './pages/Home'
import Lobby       from './pages/Lobby'
import StarsCanvas from './components/SpaceBackground/StarsCanvas'
import Starting from './pages/Starting'
import HintPhase from './pages/HintPhase'
import Screen from './components/Screen'
import Toast from './components/Toast'
function GameScreens() {

  const { screen } = useGame()
  return (
    <>
      <StarsCanvas/>
      <Toast />
      <AnimatePresence mode="wait">
        {screen === "home" && (
            <Screen screenKey="home">
                <Home />
            </Screen>
        )}

        {screen === "lobby" && (
            <Screen screenKey="lobby">
                <Lobby />
            </Screen>
        )}

        {screen === "starting" && (
            <Screen screenKey="starting">
                <Starting />
            </Screen>
        )}

        {screen === "hintPhase" && (
            <Screen screenKey="hintPhase">
                <HintPhase />
            </Screen>
        )}
      </AnimatePresence>
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
