function createGameboard(config = { width: 10, length: 10 }) {
  const grid = [];

  for (let i = 0; i < config.width; i++) {
    grid.push([]);
    for (let j = 0; j < config.length; j++) {
      grid[i].push({ empty: true, wasShotAt: false });
    }
  }

  const placeShip = (location, ship) => {
    const { x, y, alignment } = location;

    if (x < 0 || x > config.width || y < 0 || y > config.length) {
      throw new Error('Invalid coordinates');
    }

    if (x + ship.length > config.width || y + ship.length > config.length) {
      throw new Error(
        'Cannot place ship. The ship is out of gameboard bounds.',
      );
    }

    switch (alignment) {
      case 'horizontal':
        for (let i = 0; i < ship.length; i++) {
          grid[x + i][y] = { ship, part: i };
        }
        break;

      case 'vertical':
        for (let i = 0; i < ship.length; i++) {
          grid[x][y + i] = { ship, part: i };
        }

        break;

      default:
        break;
    }
  };

  const receiveAttack = ({ x, y }) => {
    if (grid[x][y].empty) {
      grid[x][y].wasShotAt = true;
      return 'missed';
    }
    const { ship, part: hitPart } = grid[x][y];
    return { ship, hitPart };
  };

  return { placeShip, receiveAttack, grid };
}

export default createGameboard;
