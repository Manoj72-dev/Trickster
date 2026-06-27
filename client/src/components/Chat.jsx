import { GrSend } from "react-icons/gr";
import { PiChatsCircleFill } from "react-icons/pi";

function Chat(){
    return(
        <div className="flex flex-col h-full font-mono border p-4 border-white rounded-xl min-h-[400px]">
            <span className="flex items-center gap-2 text-white"><span><PiChatsCircleFill size={20}/> </span> Chats </span>
            <div className="flex flex-col  h-full justify-end">
                <div className=" p-2 flex-1">

                </div>
                <div className="flex items-center gap-2 border border-white rounded-xl p-2 mt-3">
                    <input
                        className="flex-1 text-white placeholder:text-gray-500 outline-none"
                        type="text"
                        placeholder="Type a message..."
                    />

                    <button
                        className="bg-gray-900 px-3 py-1 border border-gray-600 rounded-lg
                        hover:scale-105 active:scale-95 transition duration-300"
                    >
                        <GrSend size={22} className="text-white" />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Chat;