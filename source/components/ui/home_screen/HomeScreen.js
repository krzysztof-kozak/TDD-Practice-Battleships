import style from './style.module.scss';

const homeScreen = (function homeScreen() {
  const getTitle = () => {
    const title = document.createElement('h1');
    title.textContent = 'Battleships';
    title.classList.add(style.title);
    return title;
  };

  const getInput = () => {
    const input = document.createElement('input');
    input.classList.add(style.input);
    input.setAttribute('placeHolder', 'Player');
    return input;
  };

  const getButton = () => {
    const button = document.createElement('button');
    button.classList.add(style.button);
    button.textContent = 'start';
    return button;
  };

  const getWrapper = () => {
    const div = document.createElement('div');
    div.classList.add(style.wrapper);
    return div;
  };

  const render = (selector) => {
    const container = document.querySelector(selector);
    const title = getTitle();
    const input = getInput();
    const button = getButton();
    const wrapper = getWrapper();

    wrapper.appendChild(input);
    wrapper.appendChild(button);

    container.appendChild(title);
    container.appendChild(wrapper);
  };

  return { render };
})();

export default homeScreen;
