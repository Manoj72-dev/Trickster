import { useGameState } from '../hooks/useGameState'
import { useGameActions } from '../hooks/useGameActions';

import PlayersList from "../components/Lobby/PlayersList"
import NavBar from "../components/Lobby/NavBar";
import Chat from "../components/Chat";


function Lobby(){
    const room = useGameState(state => state.room)
    const socketId = useGameState(state => state.socketId);

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
            alert("Need at least 3 players to start.");
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
            <div className="p-3 grid gap-4 grid-cols-2 max-[630px]:grid-cols-1 min-h-[580px] ">
                <PlayersList/>
                <Chat/>
                
                
            </div>
                <div className="text-white/80 flex justify-between p-2 font-mono">
                    <div className="flex gap-3 ml-2">
                        <button onClick={() => toggleReady(roomCode)}
                            className={`font-bold border min-w-[120px] rounded-xl p-2 active:scale-95 transition duration-300 text-xl
                                ${me?.isReady 
                                    ? 'bg-white text-black' 
                                    : 'hover:bg-white hover:text-black hover:scale-110'}`}>
                            {me?.isReady ? 'Not ready' : 'Ready'}
                        </button>
                        <button className="font-bold border rounded-xl p-2
                            hover:bg-white hover:text-black hover:scale-110
                            active:bg-white active:text-black active:scale-95
                            transition duration-300 text-xl"
                            onClick={() => leaveLobby(roomCode)}>
                            Leave
                        </button>
                    </div>
                    <div className="mr-2">
                        <button
                            onClick={() => {handleStart()}}
                            disabled={!Host}
                            className={`min-w-[130px] rounded-xl p-2 font-bold text-xl transition duration-300
                            ${
                                Host
                                ? "bg-red-500 hover:scale-110 active:scale-95"
                                : "bg-red-500/40 opacity-50 cursor-not-allowed"
                            }`}
                        >
                            Start Game
                        </button>
                    </div>
                </div>
        </div>
    )
}

export default Lobby;
