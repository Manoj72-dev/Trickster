import { useContext } from "react";
import { GameContext } from "../context/GameContextObject";
import { useGameStore } from "../store/gameStore";

export function useGame() {
  const actions = useContext(GameContext);

  if (!actions) {
    throw new Error("useGame must be used within a GameProvider.");
  }

  const state = useGameStore()

  return { ...state, ...actions };
}
