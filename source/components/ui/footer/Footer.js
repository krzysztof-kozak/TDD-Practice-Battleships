/* <footer><p>Krzysztof Kozak</p><a aria-roledescription="github link" class="github-icon" href="https://github.com/krzysztof-kozak/odin-todo-app" target="_blank"><img src="https://img.icons8.com/fluency/24/000000/github.png"></a></footer> */

import style from './style.module.scss';

function footer() {
  const footerElement = document.createElement('footer');
  footerElement.classList.add(style.footer);
  footerElement.innerHTML = `
    <p>Krzysztof Kozak</p>
    <a aria-roledescription="github link" class="${style.githubIcon}" href="https://github.com/krzysztof-kozak/TDD-Practice-Battleships" target="_blank">
    <img src="https://img.icons8.com/fluency/24/000000/github.png"></a>`;

  return footerElement;
}

export default footer;
