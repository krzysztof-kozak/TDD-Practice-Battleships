import { createShip, createGameboard } from '../components';

describe('Gameboard can:', () => {
  test('Place ship(length 4) at specific location (0, 0, horizontal)', () => {
    const gameboard = createGameboard();
    const ship = createShip(4);
    gameboard.placeShip({ x: 0, y: 0, alignment: 'horizontal' }, ship);

    expect(gameboard.grid[0][0]).toEqual({ ship, part: 0 });
    expect(gameboard.grid[1][0]).toEqual({ ship, part: 1 });
    expect(gameboard.grid[2][0]).toEqual({ ship, part: 2 });
    expect(gameboard.grid[3][0]).toEqual({ ship, part: 3 });
  });

  test('Place ship(length 3) at specific location (2, 3, vertical)', () => {
    const gameboard = createGameboard();
    const ship = createShip(3);
    gameboard.placeShip({ x: 2, y: 3, alignment: 'vertical' }, ship);

    expect(gameboard.grid[2][3]).toEqual({ ship, part: 0 });
    expect(gameboard.grid[2][4]).toEqual({ ship, part: 1 });
    expect(gameboard.grid[2][5]).toEqual({ ship, part: 2 });
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

describe('Gameboard can receive an attack and:', () => {
  const gameboard = createGameboard();
  const ship = createShip(5);
  gameboard.placeShip({ x: 0, y: 0, alignment: 'horizontal' }, ship);

  test('report a missed shot', () => {
    const report = gameboard.receiveAttack({ x: 0, y: 1 });
    expect(report).toBe('missed');

    expect(gameboard.grid[0][1]).toEqual({ empty: true, wasShotAt: true });
    expect(gameboard.grid[0][2]).toEqual({ empty: true, wasShotAt: false });
    expect(gameboard.grid[0][3]).toEqual({ empty: true, wasShotAt: false });
    expect(gameboard.grid[0][4]).toEqual({ empty: true, wasShotAt: false });
  });

  test('record a succesful shot and report which part was damaged', () => {
    const report = gameboard.receiveAttack({ x: 0, y: 0 });
    expect(report).toEqual({ ship, hitPart: 0 });
  });
});

describe('Gameboard keeps tack of the ships', () => {
  const gameboard = createGameboard();
  const shipA = createShip(3);
  const shipB = createShip(4);
  const shipC = createShip(5);

  test('Keeps track of one added ship', () => {
    gameboard.placeShip({ x: 0, y: 0, alignment: 'horizontal' }, shipA);
    expect(gameboard.ships.length).toBe(1);
  });

  test('Keeps track of two added ships', () => {
    gameboard.placeShip({ x: 0, y: 0, alignment: 'horizontal' }, shipB);
    expect(gameboard.ships.length).toBe(2);
  });

  test('Keeps track of three added ships', () => {
    gameboard.placeShip({ x: 0, y: 0, alignment: 'horizontal' }, shipC);
    expect(gameboard.ships.length).toBe(3);
  });
});
