import { createShip } from '../components';

describe('Ship has:', () => {
  const ship = createShip(4);

  test('the right length', () => {
    expect(ship.length).toBe(4);
  });

  test('the right number of parts', () => {
    expect(ship.shipParts.length).toBe(4);
  });

  test('a working isSunk method', () => {
    expect(ship.isSunk()).toBe(false);
  });
});

describe('Ship can:', () => {
  const ship = createShip(4);

  test('be hit', () => {
    ship.hit(0);
    expect(ship.shipParts[0].isHit).toBe(true);
    expect(ship.isSunk()).toBe(false);
  });

  test('be sunk', () => {
    ship.hit(1);
    ship.hit(2);
    ship.hit(3);
    expect(ship.isSunk()).toBe(true);
  });
});
