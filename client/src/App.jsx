import { useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'

import { useGameState } from './hooks/useGameState'
import { connectSocket } from './sockets/socket'
import { registerSocketHandlers } from './sockets/socketHandlers'

import StarsCanvas from './components/SpaceBackground/StarsCanvas'
import AnimatedContainer from './AnimatedContainer/AnimatedContainer'

import Home from './pages/Home'
import Lobby from './pages/Lobby'
import Starting from './pages/Starting'
import HintPhase from './pages/HintPhase'

import { presets } from './AnimatedContainer/presets'

function GameScreen() {
  const screen = useGameState(state => state.screen)

  const screens = {
    home: {
      component: Home,
      preset: "fade",
    },
    lobby: {
      component: Lobby,
      preset: "fade",
    },
    starting: {
      component: Starting,
      presets: 'fade',
    },
    hint: {
      component: HintPhase,
      presets: 'fade',
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
