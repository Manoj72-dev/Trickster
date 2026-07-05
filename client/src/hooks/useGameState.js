import { useGameStore } from '../store/gameStore'

export function useGameState(selector) {
    return useGameStore(selector);
}