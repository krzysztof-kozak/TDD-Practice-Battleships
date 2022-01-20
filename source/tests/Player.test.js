import { createPlayer, createGameboard, createShip } from '../components';

test('Create a player named Bob', () => {
  const player = createPlayer('Bob');
  expect(player.name).toBe('Bob');
  expect(player.isABot).toBe(false);
});

test('Create an AI player', () => {
  const aiPlayer = createPlayer('T-800', { isABot: true });
  expect(aiPlayer.name).toBe('T-800');
  expect(aiPlayer.isABot).toBe(true);
});

test('Player can attack enemy board', () => {
  const player = createPlayer('Bob');
  const enemyShip = createShip(3);
  const enemyBoard = createGameboard();

  enemyBoard.placeShip({ x: 0, y: 1, alignment: 'horizontal' }, enemyShip);

  expect(player.attack(enemyBoard, { x: 0, y: 0 })).toBe('missed');

  expect(player.attack(enemyBoard, { x: 0, y: 1 })).toEqual({
    ship: enemyShip,
    hitPart: 0,
  });

  expect(() => {
    player.attack(enemyBoard, { x: 25, y: 35 });
  }).toThrowError('Invalid coordinates');

  expect(() => {
    player.attack(enemyBoard, { x: -2, y: -3 });
  }).toThrowError('Invalid coordinates');
});
