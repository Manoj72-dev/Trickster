const { values } = require('../store/words');
const { createPlayerObject, getPublicPlayerObject } = require('./Player')

function createRoomObject(roomCode, hostId, hostName) {
  return {
    roomCode,
    hostId,
    imposterId: null,
    phase: 'lobby',

    settings: {
      maxPlayers: 8,
      hintTime: 60,
      voteTime: 60,
    },

    words: {
      real: null,
      imposter: null,
    },

    players: new Map([[hostId, createPlayerObject(hostId, hostName, true, false)]]),

    phaseCompleted: new Set(),

    round: {
      current: 1,
      hints: new Map(),
      votes: new Map(),
      tieOccurred: false,
    },

    timers: {
      current: null,
      endTime: null,
      connectionCheck: null,
    },

    result: null,
  };
}

function getPublicRoomObject(room) {
  return {
    roomCode: room.roomCode,
    hostId: room.hostId,
    phase: room.phase,
    settings: room.settings,
    players: [...room.players.values()].map(getPublicPlayerObject),

    round: {
      current: room.round.current,
      hints: [...room.round.hints.values()],
    },
    endTime: room.timers.endTime,
    result: room.result,
  };
}

module.exports = { createRoomObject, getPublicRoomObject }



