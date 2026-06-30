import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "../hooks/useGame";

function Starting({ nextPhase }) {
    const { setScreen } = useGame();
    const messages = [
        "YOU ARE",
        "THE IMPOSTER",
        "YOUR WORD IS...",
        "GOOD LUCK!"
    ];
    const [visibleCount, setVisibleCount] = useState(0);

    
    useEffect(() => {
        const interval = setInterval(() =>{
            setVisibleCount(prev => {
                if(prev < messages.length) return prev + 1;

                clearInterval(interval);
                return prev;
            });
        }, 1500);
        return () => clearInterval(interval)
    },[])

    useEffect(() => {
        if (visibleCount === messages.length) {
            const timer = setTimeout(() => {
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [visibleCount]);

    return (
        <div className="flex flex-col justify-center items-center h-screen text-white">
            <AnimatePresence mode="wait">
                {messages.slice(0, visibleCount).map((message)=>(
                    <motion.h1
                        key={message}
                        initial={{ opacity: 0, x: -100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.7 }}
                        className="text-4xl font-bold"
                    >
                        {message}
                    </motion.h1>
                ))}
                    
            </AnimatePresence>
        </div>
    );
}

export default Starting;