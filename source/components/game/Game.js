import { createGameboard } from '../gameboard';
import { homeScreen, board } from '../ui';
import style from '../ui/home_screen/style.module.scss';

const game = (function game() {
  const handleStartGame = () => {
    const playerBoard = createGameboard();
    board.render(playerBoard.grid);
  };

  const initialize = () => {
    homeScreen.render('body');

    const button = document.querySelector(`.${style.button}`);
    button.addEventListener('click', handleStartGame);
  };

  return { initialize };
})();

export default game;
