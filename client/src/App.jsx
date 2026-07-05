import { useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'

import { useGameState } from './hooks/useGameState'
import { connectSocket } from './sockets/socket'
import { registerSocketHandlers } from './sockets/socketHandlers'

import StarsCanvas from './components/SpaceBackground/StarsCanvas'
import AnimatedContainer from './AnimatedContainer/AnimatedContainer'

import Home from './pages/Home'
import Lobby from './pages/Lobby'

function GameScreen() {
  const screen = useGameState(state => state.screen)

  const screens = {
    home: {
      component: Home,
      preset: "slideDown",
    },
    lobby: {
      component: Lobby,
      preset: "slideUp",
    },
  };

  const current = screens[screen];

  if(!current) return null;

  const Screen = current.component;

  return (
    <AnimatePresence  mode="wait">
      <AnimatedContainer 
        key={screen} 
        preset={current.preset}
      >
            <Screen />
      </AnimatedContainer>
    </AnimatePresence>
  )
}

function App() {
  useEffect(()=>{
    connectSocket();
    registerSocketHandlers();
  },[])
  return (
    <>
      <StarsCanvas />
      <GameScreen />
    </>
  )
}

export default App
