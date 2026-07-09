import { create } from 'zustand';

export const useGameStore = create((set) => ({

    connected: false,
    socketId: null,

    screen: 'home',
    loading: false,
    error: '',

    playerName: '',

    room: null,
    
    messages: [],

    myWord: '',
    isImposter: false,

    setConnected: (connected) => set({ connected }),
    setSocketId: (socketId) => set({ socketId }),

    setScreen: (screen) => set({ screen }),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),

    setPlayerName: (playerName) => set({ playerName }),

    setRoom: (room) => set({ room }),
    addChatMessage: (message) =>
        set((state) => ({
            messages: [...state.messages, message],
        })),

    setPlayerRole: ({ word, role }) =>
        set({
            myWord: word,
            isImposter: role === "imposter",
        }),
    
    getMe: () => {
        const state = useGameStore.getState();

        if (!state.room || !state.socketId) return null;

        return (
            state.room.players.find(
                (player) => player.id === state.socketId
            ) || null
        );
    },
}));