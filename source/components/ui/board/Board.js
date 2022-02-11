import style from './style.module.scss';

const board = (function board() {
  const render = (grid) => {
    const container = document.createElement('div');
    container.classList.add(style.container);

    const fragment = new DocumentFragment();

    grid.forEach((array, x) => {
      let y = 0;
      for (let i = 0; i < array.length; i++) {
        const cell = document.createElement('div');
        cell.classList.add(style.cell);
        cell.dataset.type = 'cell';
        cell.dataset.x = x;
        cell.dataset.y = y;
        fragment.appendChild(cell);
        y += 1;
      }
    });

    container.appendChild(fragment);
    document.querySelector('body').appendChild(container);
    return container;
  };

  return { render };
})();

export default board;
