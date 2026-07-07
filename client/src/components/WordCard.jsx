import { useGameState } from "../hooks/useGameState";


function WordCard(){
    const word = useGameState(state => state.myWord);
    const isImposter = useGameState(state => state.isImposter);

    return(
        <>
            <div className="flex flex-col justify-center items-center py-10 rounded-xl border border-gray-700/70">
                <span className="text-white/50"> 
                    your word is...
                </span>
                <span className={`max-[400px]:text-5xl text-6xl font-bold ${isImposter? 'text-red-900': 'text-green-900'}`}> 
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