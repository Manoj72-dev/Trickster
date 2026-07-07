import { useGameState } from "../../hooks/useGameState";

function PlayerCards(){
    const players = useGameState(state => state.room.players);
    return(
        <>
            <div className="flex flex-col gap-4 font-mono">
                    <div className="text-white/80">
                        players
                    </div>
                    <div className="flex flex-col gap-2 p-2">
                        {players.map((player)=> {
                            return(
                                <div className="bg-gray-700/40 p-2 border border-gray-700/70 rounded-xl">
                                    <div className="flex gap-2">
                                        <div className="flex justify-center items-center h-[50px] w-[50px] rounded-full bg-white/80 text-3xl font-bold">
                                            {player.name[0].toUpperCase()}
                                        </div>
                                        <div className="flex flex-col ">
                                            <span className="text-white/80 font-bold ">{player.name}</span>
                                            <span className={player.isConnected ? "text-green-800 text-xs font-bold" : "text-red-900 tex-xs font-bold"}>{player.isConnected? 'connected': 'disconnected'}</span>
                                        </div>
                                    </div>
                                    
                                </div>
                            )
                        })}
                    </div>
            </div>
        
        </>
    )
}

export default PlayerCards;