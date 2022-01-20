import { createPlayer } from '../components';

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
