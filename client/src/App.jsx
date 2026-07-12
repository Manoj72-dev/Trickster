import { use, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'

import { useGameState } from './hooks/useGameState'
import { connectSocket } from './sockets/socket'
import { registerSocketHandlers } from './sockets/socketHandlers'

import StarsCanvas from './components/SpaceBackground/StarsCanvas'
import AnimatedContainer from './AnimatedContainer/AnimatedContainer'

import Home from './pages/Home'
import Lobby from './pages/Lobby'
import RoundStart from './pages/RoundStart'
import HintPhase from './pages/HintPhase'
import VotingPhase from './pages/VotingPhase'
import RoundEnd from './pages/RoundEnd'
import Result from './pages/Result'
import Toast from './components/Toast' 

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
      component: RoundStart,
      presets: 'fade',
    },
    hint: {
      component: HintPhase,
      presets: 'fade',
    },
    voting: {
      component: VotingPhase,
      presets: 'fade',
    },
    elimination: {
      component: RoundEnd,
      present: 'fade',
    },
    ended: {
      component: Result,
      presets: 'fade',
    },
  };

  const current = screens[screen];

  if(!current) return null;

  const Screen = current.component;

  return (
    <>
    <AnimatePresence  mode="wait">
      <AnimatedContainer 
        key={screen} 
        preset={current.preset}
      >
            <Screen />
      </AnimatedContainer>
    </AnimatePresence>
    </>
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
      <Toast/>
      <GameScreen />
    </>
  )
}

export default App
