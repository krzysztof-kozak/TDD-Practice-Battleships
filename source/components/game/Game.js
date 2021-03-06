import { createShip } from '../ship';
import { createGameboard } from '../gameboard';
import { createPlayer } from '../player';
import { homeScreen, board, placementMessage, footer } from '../ui';
import style from '../ui/home_screen/style.module.scss';

const game = (function game() {
  let title;
  let wrapper;

  let player;
  let computer;

  let computerBoard;
  let computerDOMGrid;

  let playerBoard;
  let playerDOMGrid;

  let playerShipCount;
  let computerShipCount;

  const restartGame = () => {
    playerBoard = null;
    playerDOMGrid.remove();

    computerBoard = null;
    computerDOMGrid.remove();

    title.classList.remove('hidden');
    wrapper.classList.remove('hidden');
  };

  const startBattle = () => {
    playerShipCount = playerBoard.ships.length;
    computerShipCount = computerBoard.ships.length;

    let currentTurn = 'player';
    const switchTurns = (turn) => (turn === 'player' ? 'computer' : 'player');

    const makeComputerMove = () => {
      const target = computer.randomAttack(playerBoard.getValidMoves());
      const hitResult = computer.attack(playerBoard, target.coords);

      if (hitResult === 'missed') {
        playerDOMGrid.querySelector(
          `[data-x="${target.coords.x}"][data-y="${target.coords.y}"]`,
        ).style.backgroundColor = 'hsl(240deg 75% 75%)';

        currentTurn = switchTurns(currentTurn);
        return;
      }

      const { ship, hitPart } = hitResult;
      ship.hit(hitPart);

      playerDOMGrid.querySelector(
        `[data-x="${target.coords.x}"][data-y="${target.coords.y}"]`,
      ).style.backgroundColor = 'hsl(0deg 75% 45%)';

      if (ship.isSunk()) {
        playerShipCount -= 1;

        Swal.fire({
          title: 'Ship down!',
          text: `Enemy has sunk your ${ship.name}`,
          icon: 'warning',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK',
        }).then(() => {
          if (playerShipCount === 0) {
            // eslint-disable-next-line no-use-before-define
            announceWinner('Computer');
          }
        });
      }

      currentTurn = switchTurns(currentTurn);
    };

    const messages = document.querySelectorAll('body > p');
    messages.forEach((msg) => msg.remove());

    const handleTurn = (e) => {
      if (e.target.dataset.type !== 'cell') {
        return;
      }

      if (e.target.dataset.clicked) {
        return;
      }

      if (currentTurn === 'computer') {
        return;
      }

      e.target.dataset.clicked = true;

      const { x, y } = e.target.dataset;
      const hitResult = player.attack(computerBoard, { x, y });

      if (hitResult === 'missed') {
        currentTurn = switchTurns(currentTurn);
        e.target.style.backgroundColor = 'hsl(240deg 75% 75%)';
        makeComputerMove();
        return;
      }

      const { ship, hitPart } = hitResult;

      ship.hit(hitPart);
      e.target.style.backgroundColor = 'hsl(0deg 75% 45%)';

      if (ship.isSunk()) {
        computerShipCount -= 1;

        Swal.fire({
          title: 'Ship down!',
          text: `You've sunk enemy ${ship.name}`,
          icon: 'success',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK',
        }).then(() => {
          if (computerShipCount === 0) {
            // eslint-disable-next-line no-use-before-define
            announceWinner('Player');
          }
        });
      }

      currentTurn = switchTurns(currentTurn);
      makeComputerMove();
    };

    const announceWinner = (winner) => {
      computerDOMGrid.removeEventListener('click', handleTurn);

      Swal.fire({
        title: 'Battle report',
        text: `${winner} has won the battle!`,
        icon: 'info',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Restart',
      }).then(() => {
        restartGame();
      });
    };

    computerDOMGrid.addEventListener('click', handleTurn);
  };

  const placeComputerShips = () => {
    computer = createPlayer('Computer', { isABot: true });
    computerBoard = createGameboard();
    computerDOMGrid = board.render(computerBoard.grid);

    const shipsToPlace = [
      { ship: createShip(5, 'Carrier') },
      { ship: createShip(4, 'Battleship') },
      { ship: createShip(3, 'Destroyer') },
      { ship: createShip(3, 'Submarine') },
      { ship: createShip(2, 'Patrol Boat') },
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

    startBattle();
  };

  const placePlayerShips = () => {
    placementMessage.render(playerDOMGrid);

    const playerSpan = document.querySelector('.player-span-js');
    const shipSpan = document.querySelector('.ship-span-js');

    const shipsToPlace = [
      { ship: createShip(5, 'Carrier') },
      { ship: createShip(4, 'Battleship') },
      { ship: createShip(3, 'Destroyer') },
      { ship: createShip(3, 'Submarine') },
      { ship: createShip(2, 'Patrol Boat') },
    ];

    let currentIndex = 0;
    const maxIndex = shipsToPlace.length - 1;

    let { ship: currentShip } = shipsToPlace[currentIndex];

    playerSpan.textContent = player.name;
    shipSpan.textContent = currentShip.name;

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

      const { x, y } = e.target.dataset;
      let currentX = parseInt(x, 10);
      let currentY = parseInt(y, 10);

      const cellsToPlaceShipOn = [];

      if (10 - currentShip.length < getAxis(placementMode, x, y)) {
        return;
      }

      playerBoard.placeShip(
        { x: parseInt(x, 10), y: parseInt(y, 10), alignment: placementMode },
        currentShip,
      );

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

      if (currentIndex === maxIndex) {
        placeComputerShips();
        // eslint-disable-next-line no-use-before-define
        removeEventListeners();
        return;
      }

      currentIndex += 1;
      const { ship: newShip } = shipsToPlace[currentIndex];
      currentShip = newShip;

      shipSpan.textContent = currentShip.name;
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
    const playerName =
      document.querySelector(`.${style.input}`).value || 'Player';
    player = createPlayer(playerName);

    playerBoard = createGameboard();
    playerDOMGrid = board.render(playerBoard.grid);

    title = document.querySelector(`.${style.title}`);
    wrapper = document.querySelector(`.${style.wrapper}`);

    title.classList.add('hidden');
    wrapper.classList.add('hidden');

    placePlayerShips();
  };

  const initialize = () => {
    homeScreen.render('body');
    document.body.appendChild(footer());

    const button = document.querySelector(`.${style.button}`);
    button.addEventListener('click', handleStartGame);
  };

  return { initialize };
})();

export default game;
