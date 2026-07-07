import { useEffect, useState } from "react";
import { MdOutlineTimer } from "react-icons/md";

import { useGameState } from "../hooks/useGameState";

import SubmitSection from "../components/Hint/submitSection";
import PlayerCards from "../components/Hint/PlayerCards";
import Timer from '../components/Timer'
function HintPhase(){
    const hintTime = useGameState(state=> state.room.settings.hintTime)    
    if(!hintTime){
        return null;
    }
    return(
        <>
        <div className="flex flex-col min-h-[60px] bg-black/90">
                <div className="flex flex-1 text-white">
                    <div className="flex justify-center items-center ml-4 font-bold font-mono text-2xl">
                        <span className="text-red-500/70">TRICK</span>
                        <span>STER</span>
                    </div>
                </div>
                <hr className="text-gray-700/70"/>
        </div>
        <div className="flex flex-col gap-2 p-2 pt-0 ">
            <div className="flex justify-between items-center p-2 font-mono" >
                <div className="flex gap-2 items-center">
                    <span className="font-bold text-lg md:text-xl text-white/80 lg:text-xl"> Hint Phase </span>
                    
                </div>
                <Timer value={hintTime}/>
            </div>
            <div className="p-3 grid gap-5 grid-cols-2 max-[800px]:grid-cols-1 min-h-[580px] ">
                <SubmitSection />
                <PlayerCards />
            <div />
            </div>

        </div>
    </>
    )
}

export default HintPhase;