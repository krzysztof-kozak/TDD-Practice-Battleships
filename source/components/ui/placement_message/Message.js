import style from './style.module.scss';

const placementMessage = (function message() {
  const currentShipInformation = document.createElement('p');
  currentShipInformation.innerHTML =
    '<span class="player-span-js"></span>, place your <span class="ship-span-js"></span>';
  currentShipInformation.classList.add(style.shipInfo);

  const placementModeInformation = document.createElement('p');
  placementModeInformation.innerHTML = `Press <span class=${style.key}>y</span> to rotate`;
  placementModeInformation.classList.add(style.placementInfo);

  const render = (referenceNode) => {
    document.body.insertBefore(currentShipInformation, referenceNode);
    document.body.insertBefore(placementModeInformation, referenceNode);
  };

  return { render };
})();

export default placementMessage;
