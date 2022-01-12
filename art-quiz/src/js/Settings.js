const rangeVolume = document.querySelector('.volume-progress');
const saveSettingd = document.querySelector('.settings__save-btn');
const settingsPage = document.querySelector('.settings-page');
const timeToggle = document.querySelector('.toggle-button');
const toggleText = document.querySelector('.toggle-text');
const gameDuration = document.querySelector('.game-duration');
let volume;
let isTimeGame;
let timeAmount;

const setLocalStorage = () => {
  localStorage.setItem('isTimeGame', timeToggle.checked);
  localStorage.setItem('volume', rangeVolume.value);
  localStorage.setItem('timeAmount', gameDuration.value);
};

const getLocalStorage = () => {
  if (localStorage.getItem('volume')) {
    volume = localStorage.getItem('volume');
    setRangeVolume(rangeVolume, volume);
  } else {
    volume = rangeVolume.value;
  }
  if (localStorage.getItem('isTimeGame')) {
    isTimeGame = JSON.parse(localStorage.getItem('isTimeGame'));
    timeToggle.checked = isTimeGame;
    if (isTimeGame) {
      toggleText.innerHTML = 'On';
    } else {
      toggleText.innerHTML = 'Off';
    }
  } else {
    isTimeGame = timeToggle.checked;
  }
  if (localStorage.getItem('timeAmount')) {
    timeAmount = localStorage.getItem('timeAmount');
    gameDuration.value = timeAmount;
  } else {
    timeAmount = gameDuration.value;
  }
};
window.addEventListener('load', getLocalStorage);

function handleRangeApdate() {
  let v = this.value;
  volume = v;
  this.style.background = `linear-gradient(to right, #FFBCA2 0%, #FFBCA2 ${v}%, #fff ${v}%, #fff 100%)`;
}
function toggleTimeGame() {
  if (this.checked) {
    toggleText.innerHTML = 'On';
    isTimeGame = true;
  } else {
    toggleText.innerHTML = 'Off';
    isTimeGame = false;
  }
}
function setRangeVolume(range, val) {
  range.value = val;
  range.style.background = `linear-gradient(to right, #FFBCA2 ${val}%, #FFBCA2 ${val}%, #fff 0%, #fff 100%)`;
}

rangeVolume.addEventListener('input', handleRangeApdate);
timeToggle.addEventListener('change', toggleTimeGame);

settingsPage.addEventListener('click', (e) => {
  e.stopPropagation();
  if (e.target.classList.contains('volume-off')) {
    setRangeVolume(rangeVolume, 0);
  } else if (e.target.classList.contains('volume-on')) {
    setRangeVolume(rangeVolume, volume);
  } else if (e.target.classList.contains('settings__save-btn')) {
    setLocalStorage();
  } else if (e.target.classList.contains('settings__default-btn')) {
    timeToggle.checked = false;
    rangeVolume.value = 45;
    gameDuration.value = 20;
    toggleText.innerHTML = 'Off';
    setLocalStorage();
  } else return;
});
