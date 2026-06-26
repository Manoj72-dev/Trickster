const wordPairs = [
  { word: 'Pizza', imposterWord: 'Burger' },
  { word: 'Beach', imposterWord: 'Pool' },
  { word: 'Guitar', imposterWord: 'Violin' },
  { word: 'Castle', imposterWord: 'Mansion' },
  { word: 'Volcano', imposterWord: 'Geyser' },
]

function getRandomPair() {
  return wordPairs[Math.floor(Math.random() * wordPairs.length)]
}

module.exports = { getRandomPair }