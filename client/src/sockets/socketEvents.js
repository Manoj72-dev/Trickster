export const EVENTS = {
    ROOM_CREATE: 'room:create',
    ROOM_CREATED: 'room:created',

    ROOM_JOIN: 'room:join',
    ROOM_JOINED: 'room:joined',

    ROOM_LEAVE: 'room:leave',
    ROOM_LEFT: 'room:left',

    PLAYER_READY: 'player:toggle',
    PLAYER_KICKED: 'room:kicked',

    PLAYER_KICK: 'kick:player',
    MAKE_HOST: 'room:host',

    ROOM_ERROR: "room:error",
    ROOM_UPDATED: 'room:updated',
    ROOM_SETTING: 'room:settings',

    CHAT_SEND: 'chat:send',
    CHAT_MESSAGE: 'chat:message',
    GAME_START: 'game:start',
    START_COMPLETED: 'start:completed',
    
    GAME_WORD: 'game:word',

    PHASE_HINT: 'phase:hint',
    HINT_SUBMIT: 'hint:submit',

    VOTE_SUBMIT: 'vote:submit',
}
