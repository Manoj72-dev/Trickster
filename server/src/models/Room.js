const { createPlayerObject, getPublicPlayerObject } = require('./Player')

function createRoomObject(roomCode, hostId, hostName) {
  return {
    roomCode,
    hostId,
    imposterId: null,
    phase: 'lobby',
    createdAt: Date.now(),

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


    round: {
      current: 1,
      hints: {},
      votes: {},
      tieOccurred: false,
    },

    timers: {
      hintPhase: null,
      connectionCheck: null,
    },

    result: {
      winner: null,
      imposterId: null,
      imposterName: null,
      realWord: null,
      imposterWord: null,
      eliminatedBy: null,
    },
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
      hints: room.round.hints,
    },
    result: room.result,
  };
}

module.exports = { createRoomObject, getPublicRoomObject }



