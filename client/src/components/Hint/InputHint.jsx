import { useGameActions } from "../../hooks/useGameActions";
import { useState } from "react";
import { useGameState } from "../../hooks/useGameState";
function InputHint(){
    const [hint, setHint] = useState('');

    const roomCode = useGameState(state => state.room.roomCode);
    const me = useGameState(state=> state.getMe());
    const loading = useGameState(state=> state.loading);
    const setError = useGameState(state => state.setError);

    if(!roomCode)
        return null;

    const { submitHint } = useGameActions();

    const handleSubmit = () => {
        const trimmedHint = hint.trim();

        if (!trimmedHint) {
            setError("Hint is required");
            return false;
        }

        submitHint(roomCode, trimmedHint);
        setHint('')
    };

    return(
        <>
            <div className="flex flex-col ">
                <span className="p-1 text-white/80"> 
                    your hint... 
                </span>
                <div className="flex gap-2 justify-end">

                    <input type="text" 
                        disabled={loading || me.hasSubmittedHint}
                        value={hint}
                        onChange={(e) => {setHint(e.target.value)}}
                        className="bg-[#0D1117] flex-1 min-[300px]:w-[200px] p-1.5 px-4 rounded-xl border border-gray-700/70 
                            text-white/80 outline-none
                            hover:scale-101
                            transition
                            duration-300"  
                    />
                    <button 
                        disabled={loading || me.hasSubmittedHint}
                        onClick={()=>{handleSubmit()}}
                        className={`rounded-xl bg-white/80 font-bold p-2 hover:scale-105 active:scale-95 transition duration-300 w-[70px] 
                            ${loading ?'animation-pluse cursor-not0allowed':''}
                        `}
                    > 
                        Submit
                    </button>
                </div>
            </div>
        </>
    )
}
export default InputHint;