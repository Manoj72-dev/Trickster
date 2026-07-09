import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaCaretLeft, FaCaretRight } from "react-icons/fa";
import { CgClose } from "react-icons/cg";

import { useGameActions } from "../../hooks/useGameActions";
import { useGameState } from "../../hooks/useGameState";

function GameSetting({ close }) {

  const settingsFromStore = useGameState(state => state.room?.settings);

  const hostId = useGameState(state => state.room?.hostId ?? []);
  const roomCode = useGameState(state => state.room?.roomCode);
  const socketId = useGameState(state => state.socketId);

  const [settings, setSettings] = useState(settingsFromStore);

  const { changeSetting } = useGameActions();

  useEffect(()=>{
    if(settingsFromStore){
      setSettings(settingsFromStore);
    }
  },[settingsFromStore]);

  if (!settings) return null;

  const isHost = socketId === hostId;

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;

    if (min === 0) return `${sec}s`;
    if (sec === 0) return `${min}m`;

    return `${min}m ${sec}s`;
  };

  const changePlayers = (dir) => {
    if (!isHost) return;

    setSettings((prev) => ({
      ...prev,
      maxPlayers: Math.min(8, Math.max(3, prev.maxPlayers + dir)),
    }));
  };

  const changeHintTime = (dir) => {
    if (!isHost) return;

    setSettings((prev) => ({
      ...prev,
      hintTime: Math.min(120, Math.max(15, prev.hintTime + dir * 15)),
    }));
  };

  const changeVoteTime = (dir) => {
    if (!isHost) return;

    setSettings((prev) => ({
      ...prev,
      voteTime: Math.min(120, Math.max(15, prev.voteTime + dir * 15)),
    }));
  };

  const handleClose = () => {
    if (isHost) {
      changeSetting(roomCode, settings);
    }

    close();
  };

  const buttonClass = `transition duration-300 ${
    isHost
      ? "hover:scale-110 active:scale-95"
      : "opacity-40 cursor-not-allowed"
  }`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center font-mono">
      <motion.div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={handleClose}
      />

      <div className="relative z-10 bg-gray-700/40 border border-gray-500 rounded-xl min-w-[450px]">

        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-white/70 hover:text-white transition"
        >
          <CgClose size={28} />
        </button>

        <div className="font-bold mt-4 mx-4 mb-2 text-xl text-gray-300">
          ROOM SETTINGS
        </div>

        <hr className="border-gray-500" />

        <div className="m-4 space-y-5">

          <div className="flex justify-between items-center text-white">
            <span className="font-bold text-lg">Max Players</span>

            <div className="flex items-center gap-2">
              <button
                disabled={!isHost}
                onClick={() => changePlayers(-1)}
                className={buttonClass}
              >
                <FaCaretLeft size={40} />
              </button>

              <span className="w-12 text-center text-2xl font-bold">
                {settings.maxPlayers}
              </span>

              <button
                disabled={!isHost}
                onClick={() => changePlayers(1)}
                className={buttonClass}
              >
                <FaCaretRight size={40} />
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center text-white">
            <span className="font-bold text-lg">Hint Time</span>

            <div className="flex items-center gap-2">
              <button
                disabled={!isHost}
                onClick={() => changeHintTime(-1)}
                className={buttonClass}
              >
                <FaCaretLeft size={40} />
              </button>

              <span className="w-20 text-center text-xl font-bold">
                {formatTime(settings.hintTime)}
              </span>

              <button
                disabled={!isHost}
                onClick={() => changeHintTime(1)}
                className={buttonClass}
              >
                <FaCaretRight size={40} />
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center text-white">
            <span className="font-bold text-lg">Voting Time</span>

            <div className="flex items-center gap-2">
              <button
                disabled={!isHost}
                onClick={() => changeVoteTime(-1)}
                className={buttonClass}
              >
                <FaCaretLeft size={40} />
              </button>

              <span className="w-20 text-center text-xl font-bold">
                {formatTime(settings.voteTime)}
              </span>

              <button
                disabled={!isHost}
                onClick={() => changeVoteTime(1)}
                className={buttonClass}
              >
                <FaCaretRight size={40} />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default GameSetting;