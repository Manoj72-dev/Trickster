import { useGameState } from "../hooks/useGameState"

function HintCards(){
    const hints = useGameState(state => state.room.round.hints)
    return(
        <>
            <div className="flex flex-col flex-1 font-mono min-h-[200px]">
                <div className="text-white/80 font-bold p-2 pb-0" >
                    HINTS SUBMITED
                </div>
                <div className="flex flex-wrap flex-1 h-full p-4 gap-3 border border-white rounded-xl">
                    {(!hints || hints.length === 0)?
                        <>
                            <div className="flex w-full  items-center justify-center text-white/80">
                                No hints submitted.
                            </div>
                        </>
                            :
                        <>
                            {hints.map((hint) => (
                                <div 
                                    className="flex flex-col border rounded-xl bg-gray-700/40 border-gray-700/70 min-w-[100px] max-w-[200px] gap-4"
                                    key={hint.playerId}
                                >
                                    <div className="flex gap-2 p-2 items-center border-b border-gray-700">
                                        <div className="flex justify-center items-center bg-white/80 rounded-full w-[25px] h-[25px]">
                                            {hint.playerName[0]}
                                        </div>
                                        <span className="text-white/80 font-bold text-sm">
                                            {hint.playerName}
                                        </span>
                                    </div>
                                    <span className="text-white/80 text-lg p-2">
                                        {hint.hint}
                                    </span>
                                </div>
                            ))}
                        </>
                    } 
                </div>
            </div>
        </>
    )
}

export default HintCards;