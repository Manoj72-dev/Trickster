import { useState } from 'react'
import { FaPlus } from "react-icons/fa";
import { FaArrowRightLong } from "react-icons/fa6";

import StarsCanvas from '../components/SpaceBackground/StarsCanvas'
import Hero from '../components/Home/Hero'
import HowTo from '../components/Home/HowTo'
import Popup from '../components/Home/Popup'


function Home(){

    const [popup, setPopup] = useState(null);

    return(
    <div className="relative w-screen h-screen">
      <StarsCanvas/>
        <Hero/>
        
        <div className='flex flex-col font-mono'>
          <div className='text-white font-semibold flex gap-3 justify-center items-center pt-20'>
            <div className='text-xl'>
              <button 
                className='border-red-500 bg-red-500 rounded-xl px-3 py-1 flex justify-center items-center gap-2 hover:scale-105 transition duration-300 active:scale-95'
                onClick={() => setPopup("create")}
            >
                <FaPlus />  
                CREATE ROOM 
              </button>
            </div>
            <div className='text-xl'>
              <button 
                className='border px-3 py-1 rounded-xl flex justify-center items-center gap-2 hover:scale-105 transition duration-300 active:scale-95 hover:bg-white hover:text-black'
                onClick={() => setPopup("join")}
              > 
                JOIN ROOM 
                <FaArrowRightLong /> 
              </button>
            </div>
           
          </div>
        </div>
          
        <HowTo/>
        {popup&& (
          <Popup
            type={popup}
            close={() => setPopup(null)}
          />
        )}
    </div>
    )
}

export default Home;
