import { useGameState } from "../hooks/useGameState";


function WordCard(){
    const word = useGameState(state => state.myWord);
    const isImposter = useGameState(state => state.isImposter);

    return(
        <>
            <div className="flex flex-col bg-[#0D1117] justify-center items-center py-10 rounded-xl border border-gray-700/70 sm:min-h-[200px]">
                <span className="text-white/50"> 
                    your word is...
                </span>
                <span className={`max-[400px]:text-5xl text-6xl font-bold ${isImposter? 'text-[#e0263f]': 'text-[#5DCAA5]'}`}> 
                    {word}
                </span>
                <span className="flex justify-center text-xs text-white/50">
                    give a hint without saying it
                </span>
            </div>
        </>

    )
}

export default WordCard;