import * as LobbyActions from '../actions/lobbyActions';
import * as HintActions from '../actions/HintActions'
export function useGameActions() {
    return {
        ...LobbyActions,
        ...HintActions,
    };
}

