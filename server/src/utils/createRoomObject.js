
function createRoomObject(roomCode, hostId, hostName) {
  return {
    roomCode,
    hostId,
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

    players: [
      createPlayer(hostId, hostName, true),
    ],

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

