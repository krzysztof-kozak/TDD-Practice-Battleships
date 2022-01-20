function createPlayer(name, config = { isABot: false }) {
  const attack = (board, coordinates) => {
    return board.receiveAttack(coordinates);
  };

  return { name, isABot: config.isABot, attack };
}

export default createPlayer;
