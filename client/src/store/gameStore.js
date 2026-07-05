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
}));