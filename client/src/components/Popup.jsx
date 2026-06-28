import { motion } from "framer-motion";
import { useState } from "react";
import { useGame } from "../hooks/useGame";

function Popup({ type, close }) {
  const {
    createRoom,
    joinRoom,
    playerName,
    setPlayerName,
    loading,
    error,
  } = useGame();

  const [roomCode, setRoomCode] = useState("");

  const handleCreate = () => {
    if (!playerName.trim()) return;

    createRoom(playerName);
  };

  const handleJoin = () => {
    if (!playerName.trim()) return;
    if (!roomCode.trim()) return;

    joinRoom(roomCode.toUpperCase(), playerName);
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Background */}
      <motion.div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={!loading ? close : undefined}
      />

      {/* Popup */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="relative z-10 w-[380px] rounded-2xl border border-gray-700 bg-gray-900/70 backdrop-blur-xl p-6 text-white font-mono"
      >
        <h2 className="mb-6 text-2xl font-bold">
          {type === "create" ? "Create Room" : "Join Room"}
        </h2>

        {error && (
          <p className="mb-4 text-sm text-red-400">
            {error}
          </p>
        )}

        {/* Name */}
        <div className="mb-4 flex flex-col gap-2">
          <label className="text-gray-300">Name</label>

          <input
            disabled={loading}
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            type="text"
            placeholder="Enter your name"
            className="rounded-lg border border-gray-700 bg-gray-800/60 p-2 outline-none focus:border-red-500 disabled:opacity-60"
          />
        </div>

        {/* Room Code */}
        {type === "join" && (
          <div className="mb-6 flex flex-col gap-2">
            <label className="text-gray-300">Room Code</label>

            <input
              disabled={loading}
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              type="text"
              placeholder="Enter room code"
              maxLength={6}
              className="rounded-lg border border-gray-700 bg-gray-800/60 p-2 uppercase tracking-widest outline-none focus:border-red-500 disabled:opacity-60"
            />
          </div>
        )}

        {/* Buttons */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            disabled={loading}
            onClick={close}
            className="rounded-lg border border-gray-600 px-4 py-2 transition hover:bg-gray-800 hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            disabled={loading}
            onClick={type === "create" ? handleCreate : handleJoin}
            className="rounded-lg bg-red-500 px-4 py-2 transition hover:bg-red-600 hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? type === "create"
                ? "Creating..."
                : "Joining..."
              : type === "create"
              ? "Create"
              : "Join"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default Popup;
