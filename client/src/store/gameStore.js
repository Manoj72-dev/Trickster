import { create } from 'zustand'

export const useGameStore = create((set, get) => ({
    socketId: null,
    connected: false,

    screen: 'home',

    room: null,
    playerName: '',
    myWord: null,
    chatMessages: [],

    error: null,
    loading: false,

    setConnected:   (connected)     => set({connected}),
    setSocketId:    (socketId)      => set({socketId}),
    setRoom:        (room)          => set({room}),
    setScreen:      (screen)        => set({screen}),
    setPlayerName:  (playerName)    => set({playerName}),
    setMyWord:      (myWord)        => set({myWord}),
    setChatMessages:(chatMessages)  => set({chatMessages}),
    addChatMessage: (message)       => set((state) => ({
        chatMessages: [...state.chatMessages, message],
    })),
    clearChatMessages: ()           => set({chatMessages: []}),
    setError:       (error)         => set({ error }),
    setLoading:     (loading)       => set({ loading }),
    clearError:     ()              => set({ error: null }),

    getMe: () => {
        const { room, socketId } = get()
        return room?.players.find(p => p.id === socketId) ?? null
    },
    isHost: () => {
        const { room, socketId } = get()
        return room?.hostId === socketId
    },

}))
