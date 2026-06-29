import { useState, useEffect, useRef } from "react";
import { GrSend } from "react-icons/gr";
import { PiChatsCircleFill } from "react-icons/pi";

import { useGame } from "../hooks/useGame";

function Chat() {
  const {
    socketId,
    sendChatMessage,
    chatMessages,
  } = useGame();

  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [chatMessages]);

  const sendMessage = () => {
    const text = input.trim();

    if (!text) return;

    sendChatMessage(text);

    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full font-mono border p-4 border-white/80 rounded-xl min-h-[400px] bg-black">
      <span className="flex items-center gap-2 text-white/80 mb-3">
        <PiChatsCircleFill size={20} />
        Chats
      </span>

      <div className="flex flex-col flex-1 min-h-0">

        <div className="flex-1 max-h-[430px] overflow-y-auto flex flex-col gap-2 p-1 hide-scrollbar">

          {chatMessages.length === 0 && (
            <div className="flex-1 flex items-center justify-center text-white/20 text-sm">
              No messages yet
            </div>
          )}

          {chatMessages.map((msg, i) => {

            if (msg.type === "system") {
              return (
                <div
                  key={i}
                  className="text-center text-xs italic text-gray-400"
                >
                  {msg.text}
                </div>
              );
            }

            const isMe = msg.senderId === socketId;

            return (
              <div
                key={i}
                className={`flex flex-col ${
                  isMe ? "items-end" : "items-start"
                }`}
              >
                {!isMe && (
                  <span className="text-[11px] text-white/30 px-1">
                    {msg.senderName}
                  </span>
                )}

                <div
                  className={`max-w-[75%] px-3 py-2 rounded-xl text-[13px] break-words ${
                    isMe
                      ? "bg-white/10 text-white rounded-tr-none"
                      : "bg-white/5 text-white/80 rounded-tl-none"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            );
          })}

          <div ref={bottomRef} />

        </div>

        <div className="flex items-center gap-2 border border-white/80 rounded-xl p-2 mt-3">

          <input
            className="flex-1 bg-transparent text-white/80 placeholder:text-gray-500 outline-none"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          <button
            onClick={sendMessage}
            disabled={!input.trim()}
            className="bg-gray-900 px-3 py-1 border border-gray-600 rounded-lg
              hover:scale-105 active:scale-95 transition
              disabled:opacity-30"
          >
            <GrSend size={20} className="text-white/80" />
          </button>

        </div>

      </div>
    </div>
  );
}

export default Chat;
