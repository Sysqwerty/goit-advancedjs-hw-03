import { fetchBreeds, fetchCatByBreed } from './cat-api';
import Choices from 'choices.js';
import 'choices.js/public/assets/styles/choices.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const selectors = {
  loader: document.querySelector('.loader'),
  catInfo: document.querySelector('.cat-info'),
  select: document.querySelector('.breed-select'),
};

const toastOptions = {
  class: 'promisesToast',
  position: 'topRight',
  close: false,
  timeout: 3000,
};

/**
 * IIFE function, adds options to select UI element on page load
 */
(() => {
  fetchBreeds()
    .then(res => {
      selectors.select.classList.remove('hide');

      const markUp = res.data
        .map(({ id, name }) => {
          return `
    <option value=${id}>${name}</option>
  `;
        })
        .join('');

      selectors.select.insertAdjacentHTML('afterbegin', markUp);
      new Choices(selectors.select, {
        searchEnabled: true,
      });
    })
    .catch(() => {
      iziToast.error({
        message: `❌ Oops! Something went wrong! Try reloading the page!`,
        ...toastOptions,
      });
    })
    .finally(() => {
      selectors.loader.classList.add('hide');
    });
})();

selectors.select.addEventListener('change', handlerSelect);

function handlerSelect() {
  selectors.catInfo.classList.add('hide');
  selectors.loader.classList.remove('hide');

  fetchCatByBreed(selectors.select.value)
    .then(res => {
      const [
        {
          url,
          breeds: [{ name, description, temperament }],
        },
      ] = res.data;

      const markUp = `
        <img src="${url}" alt="${name}">
        <div class="cat-info-text">
        <h2>${name}</h2>
        <p>${description}</p>
        <p><span>Temperament</span>: ${temperament}</p>
        </div>
        `;
      selectors.catInfo.innerHTML = markUp;
    })
    .catch(() => {
      iziToast.error({
        message: `❌ Oops! Something went wrong! Try reloading the page!`,
        ...toastOptions,
      });
    })
    .finally(() => {
      selectors.catInfo.classList.remove('hide');
      selectors.loader.classList.add('hide');
    });
}
