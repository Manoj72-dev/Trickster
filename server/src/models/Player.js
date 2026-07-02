function createPlayerObject(id, name, isHost = false, isReady = false) {
  return {
    id,
    name,
    isHost,
    isReady,

    isEliminated: false,
    isConnected: true,

    disconnectedAt: null,
    eliminatedReason: null,

    hint: null,
    hasSubmittedHint: false,
    vote: null,
    hasVoted: false,
  };
}

function getPublicPlayerObject(player) {
  return {
    id: player.id,
    name: player.name,
    isHost: player.isHost,
    isReady: player.isReady,
    isEliminated: player.isEliminated,
    isConnected: player.isConnected,
    hasSubmittedHint: player.hasSubmittedHint,
    hasVoted: player.hasVoted,
    hint: player.hint,
    // excluded: vote, eliminatedReason
  };
}

module.exports = { createPlayerObject, getPublicPlayerObject };