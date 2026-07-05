export const presets = {
    fade: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
    },

    slideUp: {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -30 },
    },

    slideDown: {
        initial: { opacity: 0, y: -30 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 30 },
    },

    slideLeft: {
        initial: { opacity: 0, x: 30 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -30 },
    },

    slideRight: {
        initial: { opacity: 0, x: -30 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: 30 },
    },

    scale: {
        initial: { opacity: 0, scale: 0.95 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.95 },
    },
};