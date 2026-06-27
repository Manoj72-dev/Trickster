import { useGame } from "../context/GameContext";
import StarsCanvas from "../components/SpaceBackground/StarsCanvas";
import PlayersList from "../components/PlayersList"
import NavBar from "../components/NavBar";
import Chat from "../components/Chat";
import { IoSettingsSharp } from "react-icons/io5";


function Lobby(){
    return(
        <div>
            <StarsCanvas/>
            <NavBar/>
            <div className="p-4 grid gap-4 grid-cols-2 max-[630px]:grid-cols-1 min-h-[570px] ">
                <PlayersList/>
                <Chat/>
                
                
            </div>
                <div className="text-white flex justify-between p-2 font-mono">
                    <div className="flex gap-6 ml-2">
                        <button className="font-bold border rounded-xl p-2 
                            hover:bg-white hover:text-black hover:scale-110
                            active:bg-white active:text-black active:scale-95
                            transition duration-300 text-xl">
                            Ready
                        </button>
                        <button className="font-bold border rounded-xl p-2
                            hover:bg-white hover:text-black hover:scale-110
                            active:bg-white active:text-black active:scale-95
                            transition duration-300 text-xl">
                            Leave
                        </button>
                    </div>
                    <div className="mr-2">
                        <button className=" border rounded-xl p-2 bg-red-500 font-bold hover:scale-110 active:scale-95 transition duration-300 text-xl">
                            Start Game
                        </button>
                    </div>
                </div>
        </div>
    )
}

export default Lobby;