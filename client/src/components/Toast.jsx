import { AnimatePresence, motion } from "framer-motion";
import { useGame } from "../hooks/useGame";

function Toast() {
    const { toast } = useGame();
    return (
        <AnimatePresence>
            {toast && (
                <motion.div
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 100 }}
                    transition={{ duration: 0.3 }}
                    className={`fixed top-5 right-5 z-60 px-4 py-3 rounded-lg shadow-lg text-white
                    ${
                        toast.type === "error"
                            ? "bg-red-500"
                            : toast.type === "success"
                            ? "bg-green-500"
                            : toast.type === "warning"
                            ? "bg-yellow-500 text-black"
                            : "bg-blue-500"
                    }`}
                >
                    {toast.message}
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default Toast;