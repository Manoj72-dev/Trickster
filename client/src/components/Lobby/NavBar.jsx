import { IoSettingsSharp } from "react-icons/io5";
import { useState } from "react";
import { useGameState } from "../../hooks/useGameState";
import { TbCopy } from "react-icons/tb";

import GameSetting from "./GameSetting";
function NavBar(){

    const [showSettings, setShowSettings] = useState(false);
    const roomCode = useGameState(state => state.room?.roomCode)
    const [copied, setCopied] = useState(false);
    
    const copy = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);

            setTimeout(() => {
                setCopied(false);
            }, 1500);
        } catch (err) {
            console.error("Failed to copy", err);
        }
    };
    return(
        <div>
            <nav>
                <div className="flex p-2 bg-[#0D1117] justify-between items-center">
                    <div>
                        <span 
                            className="text-white font-bold font-mono text-xl"
                        >
                            TRICK
                            <span 
                                className="text-[#e0263f] font-bold"
                            >
                                STER
                            </span>
                        </span>
                    </div>
                    
                    <div className="flex gap-4 items-center text-white/80"> 
                        <div className="bg-black font-mono px-2 py-1 flex items-center gap-2 border  rounded-lg">
                            <div className=" text-[10px] leading-none flex flex-col items-center">
                                <span>
                                    Room 
                                </span>
                                <span>
                                    Code
                                </span>
                            </div> 
                            <span className="text-[#e0263f] font-bold text-xl leading-none ">
                                {roomCode}
                            </span>
                            
                            <button  onClick={() => copy(roomCode)}
                                className="hover:text-white transition active:scale-95 hover:scale-105"
                                title="Copy Room Code"
                            >
                                    <TbCopy />
                            </button>
                            
                        </div>
                        <div className=" font-mono font-bold">
                            <button 
                                onClick={() => setShowSettings(true)}
                                className=" flex py-1 justify-center items-center gap-2 border rounded-lg px-2 bg-black 
                                hover:scale-105 hover:bg-white hover:text-black
                                active:scale-95
                                transition duration-300"

                            >
                                <IoSettingsSharp  size={18} />

                                <span className="text-sm max-[600px]:hidden"> SETTINGS </span> 
                            </button>
                        </div>
                    </div>
                </div>
                
            </nav>
            {showSettings && (
                <GameSetting close={() => setShowSettings(false)} />
            )}
        </div>
    )
}

export default NavBar;
