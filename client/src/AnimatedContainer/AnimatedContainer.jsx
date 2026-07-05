import { motion } from "framer-motion";
import { presets } from "./presets";

export default function AnimatedContainer({
    children,
    preset = "fade",
    transition = { duration: 0.6 },
}) {
    const animation = presets[preset];

    return (
        <motion.div
            className="w-full h-full"
            initial={animation.initial}
            animate={animation.animate}
            exit={animation.exit}
            transition={transition}
        >
            {children}
        </motion.div>
    );
}