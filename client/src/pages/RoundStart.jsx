import { useEffect, useState } from "react";
import { useGameState } from "../hooks/useGameState";
import { useGameActions } from "../hooks/useGameActions";
function RoundStart() {
    const word = useGameState(state => state.myWord);
    const isImposter = useGameState(state => state.isImposter);
    const roomCode = useGameState(state => state.room.roomCode);

    const  { startRound } = useGameActions()

    const [currentMessage, setCurrentMessage] = useState(0);
    const [currentChar, setCurrentChar] = useState(0);
    const [done, setDone] = useState(false);

    const messages =[
        'YOUR WORD IS ...', 
        word,
        'YOU ARE', 
        `${isImposter? '': 'NOT'}`,
        'THE IMPOSTER',

    ];

    function getVisibleText(currentMessage, currentChar) {
        const completed = messages.slice(0, currentMessage);
        const current =
            currentMessage < messages.length
                ? messages[currentMessage].slice(0, currentChar)
                : "";
        return [...completed, current];
    }

    useEffect(() => {
        if (!word && !isImposter) return; 
        if (currentMessage >= messages.length) {
            setDone(true);
            startRound(roomCode);
            return;
        }

        const text = messages[currentMessage];
        const timeout = setTimeout(() => {
            if (currentChar < text.length) {
                setCurrentChar(currentChar + 1);
            } else {
                setCurrentMessage(currentMessage + 1);
                setCurrentChar(0);
            }
        }, currentChar < text.length ? 50 : 700);

        return () => clearTimeout(timeout);
    }, [currentMessage, currentChar, word]);

    const lines = getVisibleText(currentMessage, currentChar);

    return (
        <div className="w-screen h-screen flex flex-col justify-center items-center font-mono">
            <div className="text-center">
                {lines.map((line, i) => {
                    const isWordLine = i === 1;
                    const isRoleLine = i === messages.length - 1 || 1=== messages.length -2;
                    return (
                        <div
                            key={i}
                            className={
                                isWordLine
                                    ? "text-6xl text-white font-bold my-4"
                                    : !isRoleLine
                                    ? "text-2xl font-bold text-white/80"
                                    : isImposter
                                    ? "text-4xl font-bold text-[#e0263f]"
                                    : "text-4xl fint-bold text-[#5DCAA5]"
                            }
                        >
                            {line}
                            {!done && i === currentMessage && (
                                <span className="animate-pulse">|</span>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default RoundStart;