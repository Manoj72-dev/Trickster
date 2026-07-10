import { useGameActions } from "../hooks/useGameActions";
import { useGameState } from "../hooks/useGameState"
import { useState } from "react";

function PlayerCard( {
  selected, 
  setSelected = () => {}
}){
    const players = useGameState(state => state.room.players);
    const screen = useGameState(state => state.screen);
    const Me = useGameState(state => state.getMe());
    const [menuOpenFor, setMenuOpenFor] = useState(null);
    const roomCode = useGameState(state => state.room.roomCode)
    const isLobby = screen ==='lobby';
    const isHintPhase = screen === 'hint';
    const isVotingPhase = screen === 'voting';

    const { kickPlayer, makeHost }= useGameActions();
    
    return (
        <div className="flex gap-4 flex-wrap justify-center">
        {
          players.map((player)=>{
            const isEliminated = player.isEliminated;
            const isConected = player.isConnected;
            const isHost = player.isHost;
            const isReady = player.isReady;
            const hasVoted = player.hasVoted;
            const hasSubmittedHint = player.hasSubmittedHint;
            const showEliminatedOverlay = isEliminated && (isHintPhase || isVotingPhase);
            return (
                <div 
                  key={player.id}
                  onClick = {() => {
                    if(isVotingPhase && !Me.hasVoted && (Me.id !== player.id) && isEliminated){
                      setSelected(player.id);
                    }
                  }}

                  className={`relative flex-1 flex-col font-mono 
                    max-w-[300px] min-w-[130px] min-[600px]:min-w-[200px]
                    bg-[#0D1117] border rounded-xl overflow-hidden
                    ${ (Me.id === player.id)? 'border-white/90': 'border-[#1F2937]'}
                    ${(isVotingPhase && !isEliminated && !(Me.id === player.id))? 'cursor-pointer hover:border-[#e0263f]/50': ''}
                    ${(selected === player.id) ? 'border-[#e0263f]/50': ''}
                  `}
                > 
                  {isLobby && Me.isHost && (Me.id !== player.id) && (
                    <div className="absolute top-2 right-2 z-20">
                      <button 
                        onClick={(e)=>{
                          e.stopPropagation();
                          setMenuOpenFor(menuOpenFor === player.id? null : player.id)
                        }}
                        className="text-[#8B949E] hover:text-[#F5F5F5] px-1 text-lg leading-none font-bold"
                      >
                        ⋮
                      </button>
                      {menuOpenFor === player.id && (
                        <div className="absolute right-0 mt-1 bg-gray-300 border border-gray-700 rounded w-24">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              kickPlayer(roomCode, player.id);
                              setMenuOpenFor(null);
                            }}
                            className="w-full text-left px-3 py-2 text-xs font-bold text-[#e0263f] hover:bg-[#e0263f]/10"
                          >
                            Kick
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              makeHost(roomCode, player.id);
                              setMenuOpenFor(null);
                            }}
                            className="w-full text-left px-3 py-2 text-xs font-bold text-gray-700 hover:bg-black/5"
                          >
                            Make Host
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex gap-1 items-center my-1 mx-2">
                    <div className={`w-[5px] h-[5px] rounded-full ${isConected? 'bg-[#5DCAA5]': 'bg-[#e0263f]'}`}/>
                    <span className={`text-xs font-bold ${isConected? 'text-[#5DCAA5]': 'text-[#e0263f]'}`}>
                      {isConected? 'connected': 'disconnected'}
                    </span>
                  </div>

                  <div className="flex flex-col justify-center items-center mt-1">
                    <div className="flex justify-center items-center font-bold text-5xl p-2 bg-white/80 w-16 h-16 
                    max-[500px]:w-14 max-[500px]:h-14  rounded-full max-[500px]:text-4xl">
                        {player.name[0].toUpperCase()}
                    </div>
                    <span className="text-white/80 text-xl font-bold max-[500px]:text-lg">
                        {player.name}
                    </span>
                  </div>
                  
                  <div className="">
                      <div className="flex flex-col h-5 items-center"> 
                        {(isLobby && isHost) &&
                          <span className="text-gray-600 text-xs font-bold bg-white/80 px-1 rounded-sm">
                            Host
                          </span>
                        }
                        
                      </div>
                      <div className="flex gap-2 justify-end p-1 mx-1">
                        { 
                          isLobby && !isEliminated &&
                          <span className={`text-xs font-bold ${isReady? 'text-[#5DCAA5]': 'text-[#e0263f]'}`}>
                            {isReady? 'Ready': 'Not ready'}
                          </span>
                        }
                        {
                          isHintPhase && !isEliminated &&
                            <span className={`text-xs font-bold ${hasSubmittedHint? 'text-[#5DCAA5]': 'text-gray-600'}`}>
                              {hasSubmittedHint? 'Submitted': ''}
                            </span>
                        }
                        {
                          isVotingPhase && !isEliminated &&
                          <>
                            <span className={`text-xs font-bold ${hasVoted? 'text-green-600': 'text-gray-600'}`}>
                              {hasVoted? 'voted': 'voting'}
                            </span>
                            <span className={`text-xs font-bold ${hasSubmittedHint? 'text-[#5DCAA5]': 'text-gray-600'}`}>
                              {hasSubmittedHint? 'Submitted': 'Not Submitted'}
                            </span>
                          </>
                        }
                      </div>
                  </div>
                  {
                    showEliminatedOverlay && (
                      <div className="absolute inset-0 bg-black/70 flex items-center justify-center pointer-events-none z-10">
                        <span className="text-[#e0263f] font-bold text-sm tracking-wider border border-[#e0263f] px-3 py-1 rounded rotate-[-8deg]">
                          ELIMINATED
                        </span>
                      </div>
                    )
                  }
                </div>
            )

          })
        }
      </div>
    )
}

export default PlayerCard;