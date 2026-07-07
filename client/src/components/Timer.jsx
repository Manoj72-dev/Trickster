import { useEffect, useState } from "react";
import { useGameState } from "../hooks/useGameState"

function Timer({time}){

    const endTime = useGameState(state => state.room.endTime);
    const [timeLeft, setTimeLeft] = useState(time)
    if(!endTime){
        return null;
    }
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    useEffect(() =>{ 
        if (!endTime) return;

        const updateTimer = () =>{
            const remaining = Math.max(0, endTime - Date.now());
            if(remaining <= 0){
                setTimeLeft(0)
                return false;
            }
            setTimeLeft(Math.ceil(remaining/1000))

            return true;
        }
        updateTimer();

        const interval = setInterval(()=>{
            if(!updateTimer()){
                clearInterval(interval)
            }
        },1000)
            
        return () => clearInterval(interval);
    },[endTime]);

    return(
        <>
            <div className="flex justify-center text-white/80 items-center gap-1">
                <span className="font-bold text-xl md:text-3xl ">
                    {minutes.toString().padStart(2, "0")}:
                    {seconds.toString().padStart(2, "0")}
                </span>
            </div>
        </>
    )
}

export default Timer;