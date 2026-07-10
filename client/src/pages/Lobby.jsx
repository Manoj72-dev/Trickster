import { useGameState } from '../hooks/useGameState'
import { useGameActions } from '../hooks/useGameActions';

import PlayersList from "../components/Lobby/PlayersList"
import NavBar from "../components/Lobby/NavBar";
import Chat from "../components/Chat";


function Lobby(){
    const room = useGameState(state => state.room)
    const socketId = useGameState(state => state.socketId);

    const setError = useGameState(state => state.setError);
    

    const { toggleReady, leaveLobby, startGame} = useGameActions();
    if (!room) return null;
    const roomCode = room.roomCode;
    const me = room.players.find(player => player.id === socketId);
    const Host = me?.isHost ?? false;

    const players = room.players ?? [];
    const enoughPlayers = players.length >= 3;
    const allReady = players.every(player => player.isReady);

    const handleStart = () =>{
        if(!enoughPlayers){
            setError("Need at least 3 players to start.");
            return;
        }
        if(!allReady){
            alert("All players are not ready");
            return;
        }
        startGame(roomCode);
    }

    return(
        <div>
            <NavBar/>
            <div className='flex p-2 justify-between font-mono px-2'>
                <span className='flex items-center text-white/90 text-2xl max-[500px]:text-xl mx-3 font-bold'>
                    Lobby
                </span>
                <div className="mr-2">
                    {Host &&
                        <button
                            onClick={() => {handleStart()}}
                            disabled={!Host}
                            className={`min-w-[120px] rounded-xl py-1 font-bold text-xl transition duration-300
                            bg-white/90 border border-white hover:scale-110 active:scale-95"
                            max-[500px]:min-w-[100px] max-[500px]:text-lg`}
                        >
                            Start
                        </button>
                    }
                 </div>
            </div>
            <div className="p-3 grid gap-4 grid-cols-2 max-[920px]:grid-cols-1 pt-1">
                <div className=''>
                    <PlayersList/>
                    
                    <div className="text-white/80  font-mono flex justify-between ml-2 ">
                        <button className="font-bold border rounded-xl px-2 py-1
                            hover:scale-110 bg-[#e0263f]
                            active:scale-95
                            transition duration-300 text-xl max-[500px]:text-lg"
                            onClick={() => leaveLobby(roomCode)}>
                            Leave
                        </button>
                        <button onClick={() => toggleReady(roomCode)}
                            className={`font-bold border min-w-[120px] rounded-xl py-1 px-2 whitespace-nowrap  active:scale-95 transition duration-300 text-xl bg-[#5DCAA5]
                                max-[500px]:text-lg hover:scale-110 text-white/80
                                ${me?.isReady 
                                    ? 'bg-[#e0263f] ' : ''}`
                            }
                        >

                            {me?.isReady ? 'Not ready' : 'Ready'}
                        </button>
                        
                    </div>
                    
                
                </div>
                <div >
                    <Chat/>
                </div>                
            </div>
                
        </div>
    )
}

export default Lobby;
