import { useEffect, useState } from "react";
import { useGameState } from "../hooks/useGameState";

function RoundEnd(){

   const eliminat = useGameState(state => state.eliminated);

    if (!eliminat) {
        return null;
    }
    const message = [
        eliminat.eliminated
            ? eliminat.eliminatedPlayer.name
            : "No one",
        "is eliminated..."
    ];
    const [currentWord, setCurrentWord] = useState(0);
    const [currentMessage, setCurrentMessage] = useState(0);

    function getVisibleText(currentMessage, currentWord){
        const completed = message.slice(0, currentMessage);
        const current =
            currentMessage < message.length
                ? message[currentMessage].slice(0, currentWord)
                : '';

        return [...completed, current];
    }

    useEffect(()=>{
        if(!eliminat)
            return
        if (currentMessage >= message.length) {
            return;
        }
        const text = message[currentMessage];
        const timeout = setTimeout(()=>{
            if(currentWord < text.length){
                setCurrentWord(currentWord+1);
            }else{
                setCurrentMessage(currentMessage+1);
                setCurrentWord(0);
            }
        }, currentWord < text.length ? 50:700)
        console.log(currentMessage, currentWord);
        return ()=> clearTimeout(timeout)
    },[currentMessage, currentWord, eliminat])

    const lines = getVisibleText(currentMessage, currentWord);
    
    return (
        <div className="flex w-screen h-screen justify-center items-center font-mono">
            <div className="text-center">
                {lines.map((line,i)=>{
                    const playername = i === 0 && eliminat.eliminated 
                        return (
                            <div
                                key={i}
                                className={`${playername?'text-3xl text-[#e0263f]': 'text-2xl text-white/80'}
                                    font-bold`}
                            >
                                {line}
                            </div>

                        )
                    })
                }
            </div>
            
        </div>
    )
}
export default RoundEnd;