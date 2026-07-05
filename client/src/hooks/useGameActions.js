import * as LobbyActions from '../actions/lobbyActions';

export function useGameActions() {
    return {
        ...LobbyActions,
    };
}

