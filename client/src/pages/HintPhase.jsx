import { useEffect, useState } from "react";
import { MdOutlineTimer } from "react-icons/md";

import { useGameState } from "../hooks/useGameState";

import SubmitSection from "../components/Hint/SubmitSection";
import PlayersList from "../components/PlayersList";
import Timer from '../components/Timer'
function HintPhase(){
    const hintTime = useGameState(state=> state.room.settings.hintTime)    
    if(!hintTime){
        return null;
    }
    return(
        <div className="border border-white">
            <div className="flex flex-col min-h-[60px] bg-black/90">
                    <div className="flex flex-1 text-white">
                        <div className="flex justify-center items-center ml-4 font-bold font-mono text-2xl">
                            <span className="text-red-500/70">TRICK</span>
                            <span>STER</span>
                        </div>
                    </div>
                    <hr className="text-gray-700/70"/>
            </div>
            <div className='flex p-2 justify-between font-mono px-2'>
                <span className='flex items-center text-white/90 text-xl sm:text-2xl mx-3 font-bold'>
                    Hint Phase
                </span>
                <div className="mr-2">
                    <Timer value={
                        hintTime
                    }/>
                 </div>
            </div>
            
            <div className="p-3 grid gap-4 grid-cols-2 max-[920px]:grid-cols-1 pt-1 border border-white">
                <SubmitSection />
                <PlayersList />
            <div />
            </div>

        
    </div>
    )
}

export default HintPhase;