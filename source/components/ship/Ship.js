function createShip(length, shipName = 'ship') {
  const name = shipName;
  const shipParts = [];

  let i = 0;
  while (i < length) {
    shipParts.push({ isHit: false });
    i += 1;
  }

  const hit = (target) => {
    shipParts[target].isHit = true;
  };

  const isSunk = () => shipParts.every((part) => part.isHit);

  return {
    name,
    length,
    shipParts,
    hit,
    isSunk,
  };
}

export default createShip;
