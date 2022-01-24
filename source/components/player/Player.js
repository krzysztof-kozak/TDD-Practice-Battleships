function createPlayer(name, config = { isABot: false }) {
  const attack = (board, coordinates) => {
    return board.receiveAttack(coordinates);
  };

  const randomAttack = (validMoves) => {
    const randomIndex = Math.floor(Math.random() * validMoves.length);
    return validMoves[randomIndex];
  };

  return { name, isABot: config.isABot, attack, randomAttack };
}

export default createPlayer;
