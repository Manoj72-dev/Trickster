import { useState, useEffect, useRef } from "react";
import { useGameState } from "../../hooks/useGameState";
import {  useGameActions } from '../../hooks/useGameActions'
function Popup({ type, close, setButton }) {
  const [roomCode, setRoomCode] = useState('');

  const nameInputRef = useRef(null);
  const codeInputRef = useRef(null);
  const loading = useGameState(state => state.loading);
  const playerName = useGameState(state => state.playerName);

  const setPlayerName = useGameState(state => state.setPlayerName);
  const setError = useGameState(state => state.setError);
  const setScreen = useGameState(state => state.setScreen);

  const { createRoom, joinRoom} = useGameActions();
  const handleClose = () => {
    setError("");
    setPlayerName("");
    setRoomCode("");
    close();
  };

  useEffect(() => {
    nameInputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && !loading) {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [loading, handleClose]);



  const handleCreate = () => {
    const name = playerName.trim();

    if (!name) {
      alert("Player name is required.");
      nameInputRef.current?.focus();
      return;
    }

    if (name.length < 3) {
      alert("Player name must be at least 3 characters.");
      nameInputRef.current?.focus();
      return;
    }

    if (name.length > 12) {
      alert("Player name cannot be longer than 12 characters.");
      nameInputRef.current?.focus();
      return;
    }
    setButton('create')
    createRoom(name);
    handleClose();
  }

  const handleJoin = () => {
    const name = playerName.trim()
    const code = roomCode.trim().toUpperCase();

    if (!name) {
      alert('playername is requried. ');
      nameInputRef.current?.focus();

      return;
    }

    if (name.length < 3) {
      alert("Player name must be at least 3 characters.");
      nameInputRef.current?.focus();
      return;
    }

    if (name.length > 12) {
      alert("Player name cannot be longer than 12 characters.");
      nameInputRef.current?.focus();
      return;
    }

    if (!code) {
      alert("Room code is required.");
      codeInputRef.current?.focus();
      return;
    }

    if (code.length !== 6) {
      alert("Room code must be exactly 6 characters.");
      codeInputRef.current?.focus();
      return;
    }
    setButton('join')
    joinRoom(code, name);
    close();
    handleClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={!loading ? handleClose : undefined}
      />

      <div
        className="relative z-10 w-[380px] rounded-2xl border border-gray-700 bg-gray-700/50 backdrop-blur-xl p-6 text-white/80 font-mono"
      >
        <h2 className="mb-6 text-2xl font-bold">
          {type === "create" ? "Create Room" : "Join Room"}
        </h2>

        <div className="mb-4 flex flex-col gap-2">
          <label className="text-gray-300">Name</label>

          <input
            ref={nameInputRef}
            disabled={loading}
            value={playerName}
            onChange={(e) => {
              setPlayerName(e.target.value)
              setError('')
            }
            }
            type="text"
            maxLength={12}
            placeholder="Enter your name"
            className="rounded-lg border border-gray-700 bg-gray-700/40 p-2 outline-none focus:border-white/80 disabled:opacity-60"
          />
        </div>

        {type === "join" && (
          <div className="mb-6 flex flex-col gap-2">
            <label className="text-gray-300">Room Code</label>

            <input
              ref={codeInputRef}
              disabled={loading}
              value={roomCode}
              onChange={(e) => {
                setRoomCode(e.target.value.toUpperCase().replace(/\s/g, ''))
                setError('')
              }
              }
              type="text"
              placeholder="Enter room code"
              maxLength={6}
              className="rounded-lg border border-gray-700 bg-gray-700/40 p-2  outline-none focus:border-white/80 disabled:opacity-60"
            />
          </div>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            disabled={loading}
            onClick={handleClose}
            className="rounded-lg border border-gray-600 px-4 py-2 transition hover:bg-gray-700/40 hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
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
      </div>
    </div>
  );
}

export default Popup;
