import { createShip } from '../ship';
import { createGameboard } from '../gameboard';
import { homeScreen, board, message } from '../ui';
import style from '../ui/home_screen/style.module.scss';

const game = (function game() {
  let computerBoard;
  let computerDOMGrid;

  let playerBoard;
  let playerDOMGrid;
  let playerName;

  const placeComputerShips = () => {
    computerBoard = createGameboard();
    computerDOMGrid = board.render(computerBoard.grid);
    console.log(computerDOMGrid);

    const shipsToPlace = [
      { name: 'carrier', ship: createShip(5) },
      { name: 'Battleship', ship: createShip(4) },
      { name: 'Destroyer', ship: createShip(3) },
      { name: 'Submarine', ship: createShip(3) },
      { name: 'Patrol Boat', ship: createShip(2) },
    ];

    const randomPlacements = [
      [
        { x: 0, y: 0, alignment: 'vertical' },
        { x: 4, y: 1, alignment: 'horizontal' },
        { x: 2, y: 4, alignment: 'horizontal' },
        { x: 6, y: 7, alignment: 'vertical' },
        { x: 8, y: 3, alignment: 'vertical' },
      ],
      [
        { x: 5, y: 0, alignment: 'horizontal' },
        { x: 1, y: 2, alignment: 'horizontal' },
        { x: 5, y: 4, alignment: 'horizontal' },
        { x: 1, y: 7, alignment: 'horizontal' },
        { x: 9, y: 8, alignment: 'vertical' },
      ],
      [
        { x: 0, y: 0, alignment: 'vertical' },
        { x: 2, y: 2, alignment: 'vertical' },
        { x: 4, y: 4, alignment: 'vertical' },
        { x: 6, y: 5, alignment: 'vertical' },
        { x: 8, y: 1, alignment: 'vertical' },
      ],
      [
        { x: 5, y: 1, alignment: 'horizontal' },
        { x: 0, y: 3, alignment: 'horizontal' },
        { x: 7, y: 5, alignment: 'horizontal' },
        { x: 1, y: 7, alignment: 'horizontal' },
        { x: 5, y: 4, alignment: 'vertical' },
      ],
    ];

    const randomIndex = Math.floor(Math.random() * randomPlacements.length);
    const placement = randomPlacements[randomIndex];

    shipsToPlace.forEach(({ ship }, index) => {
      const { x, y, alignment } = placement[index];
      computerBoard.placeShip({ x, y, alignment }, ship);
    });
  };

  const placePlayerShips = () => {
    message.render(playerDOMGrid);
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

    const handleMouseOver = (e) => {
      if (e.target.dataset.type !== 'cell') {
        return;
      }

      if (!currentShip) {
        return;
      }

      const { x, y } = e.target.dataset;
      let currentX = parseInt(x, 10);
      let currentY = parseInt(y, 10);

      const allCells = playerDOMGrid.querySelectorAll('div');
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
    };

    const handleClick = (e) => {
      if (e.target.dataset.type !== 'cell') {
        return;
      }

      if (shipsToPlace.length === 0) {
        currentShip = null;
        placeComputerShips();
        // eslint-disable-next-line no-use-before-define
        removeEventListeners();
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
    };

    const handleKeypress = (e) => {
      if (e.key !== 'y') {
        return;
      }

      placementMode = switchPlacementMode();
    };

    const removeEventListeners = () => {
      playerDOMGrid.removeEventListener('mouseover', handleMouseOver);
      playerDOMGrid.removeEventListener('click', handleClick);
      document.removeEventListener('keypress', handleKeypress);
    };

    playerDOMGrid.addEventListener('mouseover', handleMouseOver);
    playerDOMGrid.addEventListener('click', handleClick);
    document.addEventListener('keypress', handleKeypress);
  };

  const handleStartGame = () => {
    playerName = document.querySelector(`.${style.input}`).value || 'Player';
    playerBoard = createGameboard();

    playerDOMGrid = board.render(playerBoard.grid);

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
