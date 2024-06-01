import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const selectors = {
  startButton: document.querySelector('[data-start]'),
  resetButton: document.querySelector('[data-reset]'),
  days: document.querySelector('[data-days]'),
  hours: document.querySelector('[data-hours]'),
  minutes: document.querySelector('[data-minutes]'),
  seconds: document.querySelector('[data-seconds]'),
};

let selectedDate;
let timerId;

selectors.startButton.disabled = true;
selectors.resetButton.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    selectedDate = selectedDates[0];

    clearTimeCounter();

    if (selectedDate < new Date()) {
      selectors.startButton.disabled = true;
      showAlert();

      return;
    }

    selectors.startButton.disabled = false;
  },
};

flatpickr('input#datetime-picker', options);

selectors.startButton.addEventListener('click', onStartButtonClick);
selectors.resetButton.addEventListener('click', onResetButtonClick);

function onStartButtonClick() {
  selectors.startButton.disabled = true;
  selectors.resetButton.disabled = false;

  if (selectedDate - new Date() < 1) {
    selectors.resetButton.disabled = true;
    showAlert();

    return;
  }

  timerId = setInterval(() => {
    const { days, hours, minutes, seconds } = convertMs(
      selectedDate - new Date()
    );

    selectors.days.textContent = addLeadingZero(days);
    selectors.hours.textContent = addLeadingZero(hours);
    selectors.minutes.textContent = addLeadingZero(minutes);
    selectors.seconds.textContent = addLeadingZero(seconds);

    if (!days && !hours && !minutes && !seconds) {
      clearInterval(timerId);
      selectors.resetButton.disabled = true;

      return;
    }
  }, 1000);
}

function onResetButtonClick() {
  clearTimeCounter();
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return `${value}`.padStart(2, '0');
}

function showAlert() {
  iziToast.show({
    class: 'timerToast',
    message: 'Please choose a date in the future',
    backgroundColor: 'red',
    theme: 'dark',
    close: true,
    closeOnEscape: true,
    closeOnClick: true,
    position: 'topRight',
    timeout: 3000,
    rtl: true,
  });
}

function clearTimeCounter() {
  clearInterval(timerId);
  selectors.days.textContent = addLeadingZero(0);
  selectors.hours.textContent = addLeadingZero(0);
  selectors.minutes.textContent = addLeadingZero(0);
  selectors.seconds.textContent = addLeadingZero(0);
  selectors.resetButton.disabled = true;
}
