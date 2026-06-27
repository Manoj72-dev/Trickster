import { useGame } from "../context/GameContext";
import { getSocket } from "../sockets/socket";

import { ImCross } from "react-icons/im";


function PlayersList() {
    const {room, socketId} = useGame()
    console.log(room, socketId);
    return(
        <div className="font-mono p-2">
            <div className="flex flex-col gap-4">
                <span className="text-white">Players ({room.players.length}/{room.settings.maxPlayers})</span>
                <div className="flex flex-col gap-2">
                    {room.players.map((player) => (
                        <div
                            key={player.id}
                            className={`flex justify-between max-[450px]:flex-col max-[450px]:gap-2 text-white bg-gray-700/40 border ${
                                player.id === socketId ? "border-white" : "border-gray-600"
                            } p-3 rounded-lg`}
                        >
                            <span className="flex items-center gap-2 font-bold text-xl">
                                {player.name}
                                {player.isHost && (
                                    <span className="font-normal text-lg text-gray-400">
                                        [Host]
                                    </span>
                                )}
                            </span>

                            <div className="flex gap-2 justify-end">
                                <div
                                    className={`px-2 ${
                                        player.ready
                                        ? " text-white"
                                        : "text-red-500 "
                                        }
                                        `
                                    }
                                >
                                    {player.ready ? "Ready" : "Not Ready"}
                                </div>

                                {room.hostId === socketId && !player.isHost && (
                                <button className="bg-black px-2 rounded-lg border border-white hover:bg-red-600 transition duration-300 hover:scale-105 active:scale-95 ">
                                    <ImCross />
                                </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default PlayersList;