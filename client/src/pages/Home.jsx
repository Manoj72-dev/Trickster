import { useEffect, useState } from 'react'
import { FaPlus } from "react-icons/fa";
import { FaArrowRightLong } from "react-icons/fa6";

import Hero from '../components/Home/Hero'
import HowTo from '../components/Home/HowTo'
import Popup from '../components/Home/Popup'
import { useGameState } from '../hooks/useGameState';


function Home() {
  const loading = useGameState(state => state.loading);
  const [popup, setPopup] = useState(null);
  const [buttonState, setButtonState] = useState(null);

  useEffect(()=>{
    if(!loading){
      setButtonState('');
    } 
      
  },[loading])

  return (
    <div className="relative w-screen h-screen">
      <Hero />

      <div className='flex flex-col font-mono'>
        <div className='text-white font-semibold flex gap-3 justify-center items-center pt-20'>
          <div className='text-xl'>
            <button
              className={`border-red-500 bg-red-500 rounded-xl px-3 py-1 flex justify-center items-center gap-2 hover:scale-105 transition duration-300 active:scale-95 
                ${(buttonState==='create')? 'animate-pulse cursor-not-allowed': ''}`}
              disabled={buttonState !== ''}
              onClick={() => setPopup("create")}
            >
              {!(buttonState=== 'create') && <FaPlus />}
              {buttonState === 'create'? 'CREATING': 'CREATE ROOM'}
            </button>
          </div>
          <div className='text-xl'>
            <button
              className={`border px-3 py-1 rounded-xl flex justify-center items-center gap-2 hover:scale-105 transition duration-300 active:scale-95 hover:bg-white hover:text-black
                ${(buttonState === 'join')? 'animation-pluse cursor-not0allowed': ''}`}
              disabled={buttonState !== ''}
              onClick={() => setPopup("join")}
            >
              {buttonState === 'join'? 'JOINING': 'JOIN ROOM'}
              {!(buttonState === 'join') && <FaArrowRightLong />}
            </button>
          </div>

        </div>
      </div>

      <HowTo />
      {popup && (
        <Popup
          type={popup}
          close={() => setPopup(null)}
          setButton={setButtonState}
        />
      )}
    </div>
  )
}

export default Home;
