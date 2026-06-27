import { motion } from "framer-motion";
import { useState } from "react";
import { getSocket } from "../sockets/socket";
import { useGame } from "../context/GameContext";

function Popup({ type, close }) {
  const socket = getSocket();
  const { setPlayerName, error, setError } = useGame();

  const [name, setName]         = useState("");
  const [roomCode, setRoomCode] = useState("");

  const handleCreate = () => {
    if (!name.trim()) { setError("Enter your name"); return; }
    setPlayerName(name);
    socket.emit("create-room", { playerName: name });
    close();
  };

  const handleJoin = () => {
    if (!name.trim())     { setError("Enter your name"); return; }
    if (!roomCode.trim()) { setError("Enter room code"); return; }
    setPlayerName(name);
    socket.emit("join-room", {
      roomCode: roomCode.toUpperCase(),
      playerName: name,
    });
    close();
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="absolute inset-0 backdrop-blur-sm bg-black/20"
        onClick={close}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="relative z-10 w-[380px] rounded-2xl border border-gray-700 bg-gray-900/70 backdrop-blur-xl p-6 text-white font-mono font-bold"
      >
        <h2 className="text-2xl font-semibold mb-6">
          {type === "create" ? "Create Room" : "Join Room"}
        </h2>

        {error && (
          <p className="text-red-400 text-sm mb-4 font-normal">{error}</p>
        )}

        <div className="flex flex-col gap-2 mb-4">
          <label className="text-gray-300">Name</label>
          <input
            value={name}
            onChange={(e) => { setName(e.target.value); setError(null); }}
            type="text"
            placeholder="Enter your name"
            className="rounded-lg bg-gray-800/60 border border-gray-700 p-2 outline-none focus:border-red-500"
          />
        </div>

        {type === "join" && (
          <div className="flex flex-col gap-2 mb-6">
            <label className="text-gray-300">Room Code</label>
            <input
              value={roomCode}
              onChange={(e) => { setRoomCode(e.target.value); setError(null); }}
              type="text"
              placeholder="Enter room code"
              className="rounded-lg bg-gray-800/60 border border-gray-700 p-2 outline-none focus:border-red-500 uppercase tracking-widest"
            />
          </div>
        )}

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={close}
            className="rounded-lg border border-gray-600 px-4 py-2 hover:bg-gray-800 transition hover:scale-105 active:scale-95"
          >
            Cancel
          </button>
          <button
            onClick={type === "create" ? handleCreate : handleJoin}
            className="rounded-lg bg-red-500 px-4 py-2 hover:bg-red-600 transition hover:scale-105 active:scale-95"
          >
            {type === "create" ? "Create" : "Join"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default Popup;