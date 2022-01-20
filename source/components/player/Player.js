function createPlayer(name, config = { isABot: false }) {
  return { name, isABot: config.isABot };
}

export default createPlayer;
