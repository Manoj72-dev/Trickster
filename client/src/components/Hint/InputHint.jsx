import { useGameActions } from "../../hooks/useGameActions";
import { useState } from "react";
import { useGameState } from "../../hooks/useGameState";
function InputHint(){
    const [hint, setHint] = useState('');

    const roomCode = useGameState(state => state.room.roomCode);
    if(!roomCode)
        return null;

    const { submitHint } = useGameActions();

    const handleSubmit = () => {
        const trimmedHint = hint.trim();

        if (!trimmedHint) {
            alert("Hint is required");
            return false;
        }

        submitHint(roomCode, trimmedHint);
        return true;
    };

    return(
        <>
            <div className="flex flex-col ">
                <span className="p-1 text-white/80"> 
                    your hint... 
                </span>
                <div className="flex gap-2 justify-end">
                    <input type="text" 
                        value={hint}
                        onChange={(e) => {setHint(e.target.value)}}
                        className="bg-gray-700/40 flex-1 min-[300px]:w-[200px] p-1.5 px-4 rounded-xl border border-gray-700/70 
                            text-white/80 outline-none
                            hover:scale-101
                            transition
                            duration-300"  
                    />
                    <button 
                        onClick={()=>{handleSubmit()}}
                        className="rounded-xl bg-white/80 font-bold p-2 hover:scale-105 active:scale-95 transition duration-300 w-[70px]"
                    > 
                        Submit
                    </button>
                </div>
            </div>
        </>
    )
}
export default InputHint;