import { createPlayer } from '../components';

test.skip('Create a player named Bob', () => {
  const player = createPlayer('Bob');
  expect(player.name).toBe('Bob');
});
