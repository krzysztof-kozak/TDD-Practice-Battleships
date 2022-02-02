import { createShip } from '../ship';
import { createGameboard } from '../gameboard';
import { homeScreen, board, message } from '../ui';
import style from '../ui/home_screen/style.module.scss';

const game = (function game() {
  // let computerBoard;
  let playerBoard;
  let playerName;

  const placePlayerShips = () => {
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

    let placementMode = 'vertical';

    const switchPlacementMode = () => {
      if (placementMode === 'vertical') {
        return 'horizontal';
      }

      if (placementMode === 'horizontal') {
        return 'vertical';
      }

      throw new Error(
        `Unexpected placement mode. Expected "vertical" or "horizontal", but received ${placementMode}`,
      );
    };
    const getAxis = (mode, x, y) => {
      if (mode === 'horizontal') {
        return x;
      }

      if (mode === 'vertical') {
        return y;
      }

      throw new Error(
        `Unexpected parameter: "${mode}". Expected "horizontal" or "vertical"`,
      );
    };

    grid.addEventListener('mouseover', (e) => {
      if (e.target.dataset.type !== 'cell') {
        return;
      }

      if (!currentShip) {
        return;
      }

      const { x, y } = e.target.dataset;
      let currentX = parseInt(x, 10);
      let currentY = parseInt(y, 10);

      const allCells = grid.querySelectorAll('div');
      const cellsToHighlight = [];

      allCells.forEach((cell) => cell.classList.remove('highlighted'));

      if (10 - currentShip.length >= getAxis(placementMode, x, y)) {
        let cellToHighlight;

        for (let i = 0; i < currentShip.length; i++) {
          switch (placementMode) {
            case 'horizontal':
              cellToHighlight = document.querySelector(
                `[data-x="${currentX}"][data-y="${y}"]`,
              );
              currentX += 1;
              break;

            case 'vertical':
              cellToHighlight = document.querySelector(
                `[data-x="${x}"][data-y="${currentY}"]`,
              );
              currentY += 1;
              break;

            default:
              break;
          }
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
      let currentY = parseInt(y, 10);

      const cellsToPlaceShipOn = [];

      if (10 - currentShip.length < getAxis(placementMode, x, y)) {
        return;
      }

      for (let i = 0; i < currentShip.length; i++) {
        let cellToPlaceShipOn;

        switch (placementMode) {
          case 'horizontal':
            cellToPlaceShipOn = document.querySelector(
              `[data-x="${currentX}"][data-y="${y}"]`,
            );
            currentX += 1;
            break;

          case 'vertical':
            cellToPlaceShipOn = document.querySelector(
              `[data-x="${x}"][data-y="${currentY}"]`,
            );
            currentY += 1;
            break;

          default:
            break;
        }

        cellsToPlaceShipOn.push(cellToPlaceShipOn);
      }

      const isAValidPlacement = cellsToPlaceShipOn.every(
        (cell) => !cell.classList.contains('ship'),
      );

      if (!isAValidPlacement) {
        return;
      }

      cellsToPlaceShipOn.forEach((cell) => cell.classList.add('ship'));

      playerBoard.placeShip(
        { x: parseInt(x, 10), y: parseInt(y, 10), alignment: placementMode },
        currentShip,
      );

      const newShip = shipsToPlace.shift();
      name = newShip.name;
      currentShip = newShip.ship;

      shipSpan.textContent = name;
    });

    document.addEventListener('keypress', (e) => {
      if (e.key !== 'y') {
        return;
      }

      placementMode = switchPlacementMode();
    });
  };

  const handleStartGame = () => {
    playerName = document.querySelector(`.${style.input}`).value || 'Player';
    playerBoard = createGameboard();

    board.render(playerBoard.grid);

    const title = document.querySelector(`.${style.title}`);
    const wrapper = document.querySelector(`.${style.wrapper}`);

    title.classList.add('hidden');
    wrapper.classList.add('hidden');

    placePlayerShips();
  };

  const initialize = () => {
    homeScreen.render('body');

    const button = document.querySelector(`.${style.button}`);
    button.addEventListener('click', handleStartGame);
  };

  return { initialize };
})();

export default game;
