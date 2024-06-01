import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const options = {
  class: 'promisesToast',
  position: 'topRight',
  close: false,
  timeout: 5000,
};
const form = document.querySelector('.form');

form.addEventListener('submit', onFormSubmit);

function onFormSubmit(evt) {
  evt.preventDefault();

  const elements = evt.currentTarget.elements;
  let delay = Number(elements.delay.value);
  const step = Number(elements.step.value);
  const amount = Number(elements.amount.value);

  if (delay < 0 || step < 0 || amount <= 0) {
    iziToast.error({
      message: `❌ Please check the values`,
      ...options,
    });

    return;
  }

  for (let i = 1; i <= amount; i++) {
    createPromise(i, delay)
      .then(({ position, delay }) => {
        iziToast.success({
          message: `✅ Fulfilled promise ${position} in ${delay}ms`,
          ...options,
        });
      })
      .catch(({ position, delay }) => {
        iziToast.error({
          message: `❌ Rejected promise ${position} in ${delay}ms`,
          ...options,
        });
      });

    delay += step;
  }
}

function createPromise(position, delay) {
  const shouldResolve = Math.random() > 0.3;

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldResolve) {
        resolve({ position, delay });
      } else {
        reject({ position, delay });
      }
    }, delay);
  });
}
