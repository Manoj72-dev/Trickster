import { IoSettingsSharp } from "react-icons/io5";

function NavBar(){
    return(
        <nav>
                <div className="flex p-2 bg-zinc-500/10 backdrop-blur-sm justify-between items-center">
                    <div>
                        <span 
                            className="text-white font-bold font-mono text-xl"
                        >
                            TRICK
                            <span 
                                className="text-red-500 font-bold"
                            >
                                STER
                            </span>
                        </span>
                    </div>
                    
                    <div className="flex gap-4 items-center"> 
                        <div className="bg-gray-800 font-mono px-2 py-1 flex items-center gap-2 border border-gray-500 rounded-lg">
                            <div className="text-gray-400 text-xs font-bold leading-none flex flex-col items-center">
                                <span>
                                    Room 
                                </span>
                                <span>
                                    Code
                                </span>
                            </div> 
                            <span className="text-red-500 font-bold text-3xl leading-none">
                                A8KD29
                            </span>
                        </div>
                        <div className=" font-mono text-white">
                            <button 
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
    )
}

export default NavBar;