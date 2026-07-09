import { useGameState } from "../hooks/useGameState"

function PlayerCard( {
  selected, 
  setSelected = () => {}
}){
    const players = useGameState(state => state.room.players);
    const screen = useGameState(state => state.screen);
    const Me = useGameState(state => state.getMe());
    console.log(Me);
    const isLobby = screen ==='lobby';
    const isHintPhase = screen === 'hint';
    const isVotingPhase = screen === 'voting';

    
    return (
        <div className="flex gap-4 flex-wrap justify-center">
        {
          players.map((player)=>{
            const isConected = player.isConnected;
            const isHost = player.isHost;
            const isReady = player.isReady;
            const hasVoted = player.hasVoted;
            const hasSubmittedHint = player.hasSubmittedHint;
            return (
                <div 
                  key={player.id}
                  onClick = {() => {
                    if(isVotingPhase && !Me.hasVoted && (Me.id !== player.id)){
                      setSelected(player.id);
                    }
                  }}
                  className={`flex flex-col font-mono 
                    min-w-[160px] min-h-[175px] max-h-[175px] 
                    bg-gray-800/80 border  rounded-xl
                    ${(isVotingPhase && (selected === player.id))? 'border-white': 'border-gray-700'}
                  `}
                >
                  <div className="flex gap-1 items-center my-1 mx-2">
                    <div className={`w-[5px] h-[5px] rounded-full ${isConected? 'bg-green-600': 'bg-red-600'}`}/>
                    <span className={`text-xs font-bold ${isConected? 'text-green-600': 'text-red-600'}`}>
                      {isConected? 'connected': 'disconnected'}
                    </span>
                  </div>

                  <div className="flex flex-col justify-center items-center mt-1">
                    <div className="flex justify-center items-center font-bold text-5xl p-2 bg-white/80 min-w-[70px] min-h-[70px] rounded-full">
                        {player.name[0].toUpperCase()}
                    </div>
                    <span className="text-white/80 text-xl font-bold">
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
                          isLobby &&
                          <span className={`text-xs font-bold ${isReady? 'text-green-600': 'text-red-600'}`}>
                            {isReady? 'Ready': 'Not ready'}
                          </span>
                        }
                        {
                          isHintPhase &&
                            <span className={`text-xs font-bold ${hasSubmittedHint? 'text-green-600': 'text-gray-600'}`}>
                              {hasSubmittedHint? 'Submitted': ''}
                            </span>
                        }
                        {
                          isVotingPhase &&
                          <>
                            <span className={`text-xs font-bold ${hasVoted? 'text-green-600': 'text-gray-600'}`}>
                              {hasVoted? 'voted': 'voting'}
                            </span>
                            <span className={`text-xs font-bold ${hasSubmittedHint? 'text-green-600': 'text-gray-600'}`}>
                              {hasSubmittedHint? 'Submitted': 'Not Submitted'}
                            </span>
                          </>
                        }
                      </div>
                  </div>
                </div>
            )

          })
        }
      </div>
    )
}

export default PlayerCard;