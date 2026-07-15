import { useGameState } from "../hooks/useGameState";
import { useState } from "react";
import { useGameActions } from "../hooks/useGameActions";

import Timer from '../components/Timer';
import PlayerList from '../components/PlayersList'
import Chat from "../components/Chat";
import HintCards from "../components/HintCards";

function VotingPhase(){
    const [selected, setSelected] = useState(null);

    const voteTime = useGameState(state => state.room.settings.voteTime);
    const roomCode = useGameState(state => state.room.roomCode);

    const { submitVote } = useGameActions();

    const handleVote = () => {
        submitVote(roomCode, selected);
    }

    return (
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
                    <span className="font-bold text-lg md:text-xl text-white/80 lg:text-xl"> Voting Phase </span>
                    
                </div>
                <Timer value={voteTime}/>
            </div>
            <div className=" grid grid-cols-2 max-[800px]:grid-cols-1 min-h-[580px] ">
                <div className="flex flex-col gap-2 ">
                    <PlayerList/>
                    
                    <div className="flex justify-end items-center p-3">
                        <button 
                            className="font-mono text-xl text-white/80 bg-gray-900 px-3 py-1 rounded-lg border border-gray-700
                                hover:scale-105 active:scale-95 transition duration-300"
                            onClick={() => {handleVote();}}
                        >
                            Vote
                        </button>
                    </div>

                </div>
                <div className="">
                                        <HintCards/>

                    <Chat/>
                </div>
                
                
            <div />
            </div>

        </div>
        </>
    )
}

export default VotingPhase;