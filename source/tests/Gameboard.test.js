import { createShip, createGameboard } from '../components';

describe('Gameboard can:', () => {
  test('Place ship(length 4) at specific location (0, 0, horizontal)', () => {
    const gameboard = createGameboard();
    const ship = createShip(4);
    gameboard.placeShip({ x: 0, y: 0, alignment: 'horizontal' }, ship);

    expect(gameboard.grid[0][0]).toEqual(ship);
    expect(gameboard.grid[1][0]).toEqual(ship);
    expect(gameboard.grid[2][0]).toEqual(ship);
    expect(gameboard.grid[3][0]).toEqual(ship);
  });

  test('Place ship(length 3) at specific location (2, 3, vertical)', () => {
    const gameboard = createGameboard();
    const ship = createShip(3);
    gameboard.placeShip({ x: 2, y: 3, alignment: 'vertical' }, ship);

    expect(gameboard.grid[2][3]).toEqual(ship);
    expect(gameboard.grid[2][4]).toEqual(ship);
    expect(gameboard.grid[2][5]).toEqual(ship);
  });

  test('Reject invalid ship placement (out of bounds)', () => {
    const gameboard = createGameboard();
    const ship = createShip(5);

    expect(() =>
      gameboard.placeShip({ x: 6, y: 0, alignment: 'horizontal' }, ship),
    ).toThrow();

    expect(() =>
      gameboard.placeShip({ x: 0, y: 6, alignment: 'vertical' }, ship),
    ).toThrow();
  });

  test('Reject invalid ship placement (invalid coordinates)', () => {
    const gameboard = createGameboard();
    const ship = createShip(5);

    expect(() =>
      gameboard.placeShip({ x: -2, y: 0, alignment: 'horizontal' }, ship),
    ).toThrow();

    expect(() =>
      gameboard.placeShip({ x: 0, y: -2, alignment: 'vertical' }, ship),
    ).toThrow();
  });
});
