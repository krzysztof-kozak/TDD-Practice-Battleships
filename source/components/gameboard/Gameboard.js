function createGameboard(config = { width: 10, length: 10 }) {
  const grid = new Array(config.width);
  grid.fill(new Array(config.length).fill({ empty: true }));

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
          grid[x + i][y] = ship;
        }
        break;

      case 'vertical':
        for (let i = 0; i < ship.length; i++) {
          grid[x][y + i] = ship;
        }

        break;

      default:
        break;
    }
  };

  return { placeShip, grid };
}

export default createGameboard;
