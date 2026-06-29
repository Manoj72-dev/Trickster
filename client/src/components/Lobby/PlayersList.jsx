import { useGame } from "../../hooks/useGame";
import { useState, useRef, useEffect } from "react";
import { LuCrown, LuUserX, LuEllipsisVertical } from "react-icons/lu";

function PlayersList() {
  const { room, socketId, kickPlayer, makeHost } = useGame();
  const [openMenu, setOpenMenu] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target))
        setOpenMenu(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!room || !room.players) return null;

  const isHostViewing = room.hostId === socketId;

  return (
    <div className="font-mono p-2 flex flex-col gap-4">
      <span className=" font-bold text-white/80 ">
        Players ({room.players.length}/{room.settings.maxPlayers})
      </span>

      <div className="flex flex-col gap-2" ref={menuRef}>
        {room.players.map((player) => {
          const isMe = player.id === socketId;
          const isHost = player.isHost;
          const canManage = isHostViewing && !isHost;
          const menuOpen = openMenu === player.id;

          return (
            <div
              key={player.id}
              className={[
                "flex items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 border relative",
                  isMe
                  ? "bg-gray-700/50 border-white/20"
                  : "bg-gray-700/30 border-white/8",
              ].join(" ")}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={[
                    "w-[34px] h-[34px] rounded-full flex items-center justify-center text-lg font-medium shrink-0",
                      isMe
                      ? "bg-white/12 text-white/80"
                      : "bg-white/8 text-white/80",
                  ].join(" ")}
                >
                  {player.name[0].toUpperCase()}
                </div>

                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-lg font-bold text-white/80 truncate">
                    {player.name}
                  </span>
                  {isHost && (
                    <span className="shrink-0 text-[9px] font-medium tracking-widest uppercase text-gray-400 bg-gray-500/14 rounded px-1.5 py-0.5">
                      Host
                    </span>
                  )}
                </div>
              </div>

              {/* Right */}
              <div className="flex items-center gap-2 shrink-0">
                <div className={["w-[7px] h-[7px] rounded-full", player.isReady ? "bg-green-400" : "bg-white/15"].join(" ")} />
                <span className={["text-[12px]", player.isReady ? "text-green-400" : "text-white/30"].join(" ")}>
                  {player.isReady ? "Ready" : "Not ready"}
                </span>

                {canManage && (
                  <div className="relative">
                    <button
                      onClick={() => setOpenMenu(menuOpen ? null : player.id)}
                      className="w-[26px] h-[26px] rounded-md flex items-center justify-center text-white/80 bg-white/6 border border-white/12 hover:bg-white/12 hover:text-white/70 transition-all duration-150"
                      aria-label={`Options for ${player.name}`}
                    >
                      <LuEllipsisVertical size={14} />
                    </button>

                    {menuOpen && (
                      <div className="absolute right-0 top-[30px] z-20 bg-zinc-950/10 border border-white/12 rounded-[10px] overflow-hidden min-w-[140px] backdrop-blur-sm">
                        <button
                          onClick={() => {makeHost(room.roomCode, player.id); setOpenMenu(null); }}
                          className="flex items-center gap-2.5 w-full px-3.5 py-2.5 text-[13px] text-white/80 hover:bg-white/10 transition-colors text-left"
                        >
                          <LuCrown size={14} />
                          Make host
                        </button>
                        <button
                          onClick={() => { kickPlayer(room.roomCode, player.id); setOpenMenu(null); }}
                          className="flex items-center gap-2.5 w-full px-3.5 py-2.5 text-[13px] text-red-400 hover:bg-white/7 transition-colors text-left"
                        >
                          <LuUserX size={14} />
                          Kick player
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PlayersList;