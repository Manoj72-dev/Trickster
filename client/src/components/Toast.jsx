import { AnimatePresence, motion } from "framer-motion";
import { useGameState } from "../hooks/useGameState";
import { useEffect } from "react";

function Toast( ) {
    const error = useGameState(state => state.error);
    const setError = useGameState(state => state.setError);
    useEffect(()=>{
        if(error){

            const interval = setTimeout(() => {
            setError('');
            }, 5000);

            return () => clearTimeout(interval);
        }
    })
    return (
        <AnimatePresence>
            {error && (
                <motion.div
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 100 }}
                    transition={{ duration: 0.3 }}
                    className={`fixed top-5 right-5 font-bold z-60 px-4 py-3 rounded-lg shadow-lg text-white bg-red-500`}
                    onClick = {() => {
                        setError('')
                    }}
                >
                    {error}
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default Toast;