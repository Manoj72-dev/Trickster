import { useEffect } from "react";
import { useGameState } from "../hooks/useGameState";
import { useGameActions } from '../hooks/useGameActions'

function Starting() {
    const word = useGameState(state => state.myWord);
    const isImposter = useGameState(state => state.isImposter)
    const roomCode = useGameState(state => state.room?.roomCode)
    const { startPhaseCompleted } = useGameActions();
    useEffect(()=>{
        const timer = setTimeout(()=>{
            startPhaseCompleted(roomCode);
        },4000)

        return () => clearTimeout(timer);
    },[startPhaseCompleted])
    return (
<div className="w-screen h-screen flex flex-col justify-center items-center text-white/80 font-mono">            <div className="flex inset-0 flex-col justify-center items-center ">
                <span>
                    YOU ARE
                </span>
                <span>
                    {isImposter? '': 'NOT'}
                </span>
                <span>
                    THE IMPOSTER
                </span>
                <span>
                    YOUR WORD IS
                </span>
                <span>
                    {word}
                </span>
            </div>
        </div>
    )
}

export default Starting;