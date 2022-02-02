import { createShip } from '../ship';
import { createGameboard } from '../gameboard';
import { homeScreen, board, message } from '../ui';
import style from '../ui/home_screen/style.module.scss';

const game = (function game() {
  const placePlayerShips = (playerName, playerBoard) => {
    const grid = document.querySelector('div:not(.hidden)');

    message.render(grid);
    const playerSpan = document.querySelector('.player-span-js');
    const shipSpan = document.querySelector('.ship-span-js');

    const shipsToPlace = [
      { name: 'carrier', ship: createShip(5) },
      { name: 'Battleship', ship: createShip(4) },
      { name: 'Destroyer', ship: createShip(3) },
      { name: 'Submarine', ship: createShip(3) },
      { name: 'Patrol Boat', ship: createShip(2) },
    ];

    let { name, ship: currentShip } = shipsToPlace.shift();

    playerSpan.textContent = playerName;
    shipSpan.textContent = name;

    grid.addEventListener('mouseover', (e) => {
      if (e.target.dataset.type !== 'cell') {
        return;
      }

      if (!currentShip) {
        return;
      }

      const { x, y } = e.target.dataset;
      let currentX = parseInt(x, 10);

      const allCells = grid.querySelectorAll('div');
      const cellsToHighlight = [];

      allCells.forEach((cell) => cell.classList.remove('highlighted'));

      if (10 - currentShip.length >= x) {
        for (let i = 0; i < currentShip.length; i++) {
          const cellToHighlight = document.querySelector(
            `[data-x="${currentX}"][data-y="${y}"]`,
          );

          currentX += 1;
          cellsToHighlight.push(cellToHighlight);
        }

        if (cellsToHighlight.some((cell) => cell.classList.contains('ship'))) {
          return;
        }
        cellsToHighlight.forEach((cell) => cell.classList.add('highlighted'));
      } else {
        allCells.forEach((cell) => cell.classList.remove('highlighted'));
      }
    });

    grid.addEventListener('click', (e) => {
      if (e.target.dataset.type !== 'cell') {
        return;
      }

      if (shipsToPlace.length === 0) {
        currentShip = null;
        return;
      }

      const { x, y } = e.target.dataset;
      let currentX = parseInt(x, 10);

      const cellsToPlaceShipOn = [];

      if (10 - currentShip.length < x) {
        return;
      }

      for (let i = 0; i < currentShip.length; i++) {
        const cellToPlaceShipOn = document.querySelector(
          `[data-x="${currentX}"][data-y="${y}"]`,
        );
        cellsToPlaceShipOn.push(cellToPlaceShipOn);
        currentX += 1;
      }

      const isAValidPlacement = cellsToPlaceShipOn.every(
        (cell) => !cell.classList.contains('ship'),
      );

      if (!isAValidPlacement) {
        return;
      }

      cellsToPlaceShipOn.forEach((cell) => cell.classList.add('ship'));

      playerBoard.placeShip(
        { x: parseInt(x, 10), y: parseInt(y, 10), alignment: 'horizontal' },
        currentShip,
      );

      const newShip = shipsToPlace.shift();
      name = newShip.name;
      currentShip = newShip.ship;

      shipSpan.textContent = name;
    });
  };

  const handleStartGame = () => {
    const playerName = document.querySelector(`.${style.input}`).value;

    const playerBoard = createGameboard();
    board.render(playerBoard.grid);

    const title = document.querySelector(`.${style.title}`);
    const wrapper = document.querySelector(`.${style.wrapper}`);

    title.classList.add('hidden');
    wrapper.classList.add('hidden');

    placePlayerShips(playerName || 'Player', playerBoard);
  };

  const initialize = () => {
    homeScreen.render('body');

    const button = document.querySelector(`.${style.button}`);
    button.addEventListener('click', handleStartGame);
  };

  return { initialize };
})();

export default game;
