const EVENTS = {
    ROOM_CREATE: 'room:create',
    ROOM_CREATED: 'room:created',

    ROOM_JOIN: 'room:join',
    ROOM_JOINED: 'room:joined',

    ROOM_LEAVE: 'room:leave',
    ROOM_LEFT: 'room:left',

    ROOM_UPDATE: 'room:update',
    ROOM_ERROR: 'room:error',

    ROOM_SETTING_CHANGE: 'room:setting-change',

    CHAT_MESSAGE: 'chat:message',
    CHAT_SEND: 'chat:send',

    PLAYER_TOGGLE: 'player:toggle',

    PLAYER_KICK: 'player:kick',
    PLAYER_KICKED: 'player:kicked',

    PLAYER_MAKE_HOST: 'player:make-host',
    PLAYER_HOST: 'player:host',

    GAME_START: 'game:start',
    GAME_STARTING: 'game:starting',
    GAME_OVER: 'game:over',

    ROUND_START: 'round:start',
    ROUND_END: 'round:end',

    PHASE_CHANGE: 'phase:change',

    HINT_SUBMIT: 'hint:submit',
    HINT_SUBMITTED: 'hint:submitted',

    VOTE_SUBMIT: 'vote:submit',
    VOTE_SUBMITTED: 'vote:submitted',

    RETURN_HOME: 'return:home',
    RETURN_LOBBY: 'return:lobby',

}

module.exports = { EVENTS }