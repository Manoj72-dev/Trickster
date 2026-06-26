import { useState } from 'react'
import StarsCanvas from '../components/SpaceBackground/StarsCanvas'
import Hero from '../components/Hero'
import HowTo from '../components/HowTo'

import { FaPlus } from "react-icons/fa";
import { FaArrowRightLong } from "react-icons/fa6";

function Home(){
    return(
    <div className="relative w-screen h-screen">
      <StarsCanvas/>
        <Hero/>
        
        <div className='flex flex-col font-mono'>
          <div className='text-white font-semibold flex gap-3 justify-center items-center pt-20'>
            <div className='text-xl'>
              <button className='border-red-500 bg-red-500 rounded-xl px-3 py-1 flex justify-center items-center gap-2 hover:scale-105 tarnsition duration-300 active:scale-95'>
                <FaPlus />  
                CREATE ROOM 
              </button>
            </div>
            <div className='text-xl'>
              <button className='border px-3 py-1 rounded-xl flex justify-center items-center gap-2 hover:scale-105 tarnsition duration-300 active:scale-95 hover:bg-white hover:text-black'> 
                JOIN ROOM 
                <FaArrowRightLong /> 
              </button>
            </div>
          </div>
        </div>

        <HowTo/>
    </div>
    )
}

export default Home;