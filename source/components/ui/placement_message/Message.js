import style from './style.module.scss';

const message = (function message() {
  const p = document.createElement('p');
  p.innerHTML =
    '<span class="player-span-js"></span>, place your <span class="ship-span-js"></span>';

  p.classList.add(style.message);

  const render = (referenceNode) => {
    document.body.insertBefore(p, referenceNode);
  };

  return { render };
})();

export default message;
