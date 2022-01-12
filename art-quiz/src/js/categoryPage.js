import { getRandomNum, shuffle } from './functions.js';

const categoryPage = document.querySelector('.category-page');
const questionPage = document.querySelector('.questions-page');
const questionArtist = document.querySelector('.questions-page_question-artist');
const artistPictureContainer = document.querySelector('.question-picture__container');
const popupAnswer = document.querySelector('.questions-page_popup');
const resultImg = document.querySelector('.result_img');
const answerPicture = document.querySelector('.answer-picture');
const answerName = document.querySelector('.autor_name');
const answerAuthor = document.querySelector('.picture-name');
const answerYear = document.querySelector('.picture-year');
const nextButton = document.querySelector('.next');
const timer = document.querySelector('.questions-page__timeline');
const rangeTimer = document.querySelector('.time-line');
const currentTime = document.querySelector('.time-counter');

let imageArray = [];
let answer;
let pictureNumber;
let resultsArray;
let categoryName;
let totalResultArray;
let totalResultArrayPicture;
let lastPictureNumber;
let typeOfQuestion;
let gameTimer;
let isAnswerClicked = false;
let gameDuration;
let isTimeGame;

if (localStorage.getItem('resultsArray')) {
  resultsArray = JSON.parse(localStorage.getItem('resultsArray'));
} else resultsArray = [];

if (localStorage.getItem('totalResultArray')) {
  totalResultArray = JSON.parse(localStorage.getItem('totalResultArray'));
} else totalResultArray = [];

if (localStorage.getItem('totalResultArrayPicture')) {
  totalResultArrayPicture = JSON.parse(localStorage.getItem('totalResultArrayPicture'));
} else totalResultArrayPicture = [];

export async function getImagesFromJson() {
  let response = await fetch(
    'https://raw.githubusercontent.com/lena-r-a/image-data/master/images.json'
  );
  imageArray = await response.json();
  return imageArray;
}

// timer function for timegame
function startTimer() {
  let timeLost = gameDuration;
  gameTimer = setInterval(function () {
    if (questionPage.style.display == 'none') {
      clearInterval(gameTimer);
    }
    if (timeLost <= 0) {
      clearInterval(gameTimer);
      generatePopupAnswer();
      falseAnswer();
    } else {
      rangeTimer.value = (timeLost / gameDuration) * 100;
      rangeTimer.style.background = `linear-gradient(to right, #FFBCA2 0%, #FFBCA2 ${rangeTimer.value}%, #ffffff ${rangeTimer.value}%, #ffffff 100%)`;
      currentTime.textContent = `00:${String(timeLost).padStart(2, 0)}`;
      if (isAnswerClicked) {
        clearInterval(gameTimer);
      }
      --timeLost;
    }
  }, 1000);
}

// if choosed wrong answer
function falseAnswer() {
  playAudio('https://raw.githubusercontent.com/lena-r-a/image-data/master/false.mp3');
  if (resultImg.classList.contains('true')) resultImg.classList.remove('true');
  resultImg.classList.add('false');
  resultsArray[pictureNumber] = 0;
}

function generatePopupAnswer() {
  isAnswerClicked = true;
  answerPicture.style.backgroundImage = `url(' https://raw.githubusercontent.com/lena-r-a/image-data/master/img/${imageArray[pictureNumber].imageNum}.jpg')`;
  popupAnswer.style.right = '10px';
  answerAuthor.innerHTML = imageArray[pictureNumber].author;
  answerName.innerHTML = imageArray[pictureNumber].name;
  answerYear.innerHTML = imageArray[pictureNumber].year;
}

// function for playAudio
async function playAudio(url) {
  let audio = new Audio(url);
  if (localStorage.getItem('volume')) {
    audio.volume = +localStorage.getItem('volume') / 100;
  } else {
    audio.volume = 45 / 100;
  }
  try {
    await audio.play();
  } catch (err) {
    console.log('Failed to play...' + err);
  }
}

// for hide other pages and show question page
function generateQuestionPage() {
  categoryPage.classList.add('hidden');
  questionPage.style.display = 'block';
  setTimeout(() => {
    categoryPage.style.display = 'none';
    questionPage.classList.remove('hidden');
  }, 400);
}

function generateQuestionArtist(array, position) {
  artistPictureContainer.innerHTML = '';
  let question = `Which is ${array[position].author} picture?`;
  questionArtist.innerHTML = question;
  let imagesSRC = [];
  answer = `https://raw.githubusercontent.com/lena-r-a/image-data/master/img/${array[position].imageNum}.jpg`;
  imagesSRC[0] = answer;

  while (imagesSRC.length < 4) {
    let i = getRandomNum();
    if (array[i].author != array[position].author) {
      imagesSRC.push(
        `https://raw.githubusercontent.com/lena-r-a/image-data/master/img/${array[i].imageNum}.jpg`
      );
    }
  }
  shuffle(imagesSRC);
  imagesSRC.forEach((el) => {
    let img = new Image();
    img.src = el;
    let imgTag = `<img class="question-picture__container-pict" src=${el} alt="galery1">`;
    img.onload = () => {
      artistPictureContainer.innerHTML += imgTag;
    };
  });
}

function generateQuestionPicture(array, position) {
  artistPictureContainer.innerHTML = '';
  let question = `Who is the author of this picture?`;
  questionArtist.innerHTML = question;
  let questionImage = `<img class="question-image" src="https://raw.githubusercontent.com/lena-r-a/image-data/master/img/${array[position].imageNum}.jpg" alt="question-image">`;
  questionArtist.innerHTML += questionImage;
  let variantsAuthors = [];
  answer = array[position].author;
  variantsAuthors[0] = answer;
  while (variantsAuthors.length < 4) {
    let i = getRandomNum();
    if (array[i].author != answer) {
      variantsAuthors.push(array[i].author);
    }
  }
  shuffle(variantsAuthors);
  variantsAuthors.forEach((el) => {
    let aaswerTag = `<button class="author-answer button">${el}</button>`;
    artistPictureContainer.innerHTML += aaswerTag;
  });
}

// generate question page
categoryPage.addEventListener('click', (e) => {
  e.stopPropagation();
  popupAnswer.style.right = '-1500px';
  isTimeGame = localStorage.getItem('isTimeGame')
    ? JSON.parse(localStorage.getItem('isTimeGame'))
    : false;

  gameDuration = localStorage.getItem('timeAmount')
    ? JSON.parse(localStorage.getItem('timeAmount'))
    : 20;

  if (isTimeGame) {
    console.log(isTimeGame);
    timer.style.display = 'flex';
  } else {
    timer.style.display = 'none';
  }

  if (e.target.classList.contains('artist')) {
    typeOfQuestion = 'artist';
    generateQuestionPage();
    categoryName = +e.target.classList[1].replace('artist_', '');
    pictureNumber = categoryName * 10;
    lastPictureNumber = pictureNumber + 10;
    totalResultArray[categoryName] = 0;

    getImagesFromJson().then((res) => {
      generateQuestionArtist(res, pictureNumber);
      if (isTimeGame) {
        isAnswerClicked = false;
        startTimer();
      }
    });
  } else if (e.target.classList.contains('picture')) {
    typeOfQuestion = 'picture';
    generateQuestionPage();
    categoryName = +e.target.classList[1].replace('picture_', '');
    pictureNumber = categoryName * 10 + 120;
    lastPictureNumber = pictureNumber + 10;
    totalResultArrayPicture[categoryName] = 0;
    getImagesFromJson().then((res) => {
      generateQuestionPicture(res, pictureNumber);
      if (isTimeGame) {
        isAnswerClicked = false;
        startTimer();
      }
    });
  } else return;
});

// check answer
artistPictureContainer.addEventListener('click', (e) => {
  if (e.target.tagName == 'IMG') {
    generatePopupAnswer();
    if (e.target.src == answer) {
      if (resultImg.classList.contains('false')) resultImg.classList.remove('false');
      resultImg.classList.add('true');
      resultsArray[pictureNumber] = 1;
      totalResultArray[categoryName]++;
      playAudio('https://raw.githubusercontent.com/lena-r-a/image-data/master/correct.mp3');
    } else {
      falseAnswer();
    }
  } else if (e.target.tagName == 'BUTTON') {
    generatePopupAnswer();
    if (e.target.innerHTML == answer) {
      playAudio('https://raw.githubusercontent.com/lena-r-a/image-data/master/correct.mp3');
      if (resultImg.classList.contains('false')) resultImg.classList.remove('false');
      resultImg.classList.add('true');
      resultsArray[pictureNumber] = 1;
      totalResultArrayPicture[categoryName]++;
    } else {
      falseAnswer();
    }
  } else return;
});

// nextquestion
questionPage.addEventListener('click', (event) => {
  event.stopPropagation();
  if (event.target.classList.contains('next')) {
    artistPictureContainer.innerHTML = '';
    pictureNumber++;
    if (pictureNumber < lastPictureNumber) {
      if (isTimeGame) {
        isAnswerClicked = false;
        startTimer();
      }
      if (typeOfQuestion == 'artist') {
        generateQuestionArtist(imageArray, pictureNumber);
      }
      if (typeOfQuestion == 'picture') {
        generateQuestionPicture(imageArray, pictureNumber);
      }
      popupAnswer.style.right = '-1500px';
    } else if (pictureNumber == lastPictureNumber) {
      resultImg.style.display = 'none';
      playAudio('https://raw.githubusercontent.com/lena-r-a/image-data/master/end.mp3');
      answerPicture.style.backgroundImage =
        'url(https://raw.githubusercontent.com/lena-r-a/image-data/master/gameend.svg)';
      answerAuthor.innerHTML = 'Your result:';
      if (typeOfQuestion == 'artist') {
        answerName.innerHTML = `${totalResultArray[categoryName]}/10`;
      }
      if (typeOfQuestion == 'picture') {
        answerName.innerHTML = `${totalResultArrayPicture[categoryName]}/10`;
      }

      answerYear.innerHTML = '';
      answerPicture.classList.add('gameEnd');
      nextButton.innerHTML = 'Continue';
    } else {
      questionPage.style.display = 'none';
      categoryPage.style.display = 'block';
      resultImg.style.display = 'block';
      categoryPage.classList.remove('hidden');
      resultImg.classList.remove('hide');

      if (typeOfQuestion == 'artist') {
        document.querySelector(
          `.category-div__result-${categoryName}`
        ).innerHTML = `Score: ${totalResultArray[categoryName]}/10`;
        document
          .querySelector(`.category-div__result-${categoryName}`)
          .parentElement.classList.add('finishedGame');
        localStorage.setItem('totalResultArray', JSON.stringify(totalResultArray));
        localStorage.setItem('resultsArray', JSON.stringify(resultsArray));
      }

      if (typeOfQuestion == 'picture') {
        document.querySelector(
          `.category-div__result-${categoryName}`
        ).innerHTML = `Score: ${totalResultArrayPicture[categoryName]}/10`;
        document
          .querySelector(`.category-div__result-${categoryName}`)
          .parentElement.classList.add('finishedGame');
        localStorage.setItem('totalResultArrayPicture', JSON.stringify(totalResultArrayPicture));
        localStorage.setItem('resultsArray', JSON.stringify(resultsArray));
      }

      answerAuthor.innerHTML = '';
      answerName.innerHTML = '';
      answerYear.innerHTML = '';
      answerPicture.classList.remove('gameEnd');
      nextButton.innerHTML = 'Next';
      popupAnswer.style.right = '-1500px';
    }
  } else return;
});
