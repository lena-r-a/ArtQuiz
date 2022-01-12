import { getImagesFromJson } from './categoryPage.js';

const getHomeFooter = document.querySelector('.category-page__footer-home');
const getHomeHeader = document.querySelector('.header-home');
const home = document.querySelector('.home-page');
const categPage = document.querySelector('.category-page');
const scorePagePictures = document.querySelector('.score-page__pictures');
const scorePage = document.querySelector('.score-page');
const getHomeScore = document.querySelector('.score-page__footer-home');
const getCategoryScore = document.querySelector('.score-page__footer-categories');
const getHomefromSettings = document.querySelector('.settings-page__back');
const getHomeFromQuestion = document.querySelector('.question-page__logo');

function getHome() {
  home.style.display = 'block';
  home.classList.remove('hidden');
  categPage.style.display = 'none';
  categPage.classList.add('hidden');
  scorePage.style.display = 'none';
}

function getScore() {
  categPage.style.display = 'block';
  scorePage.style.display = 'none';
}

getHomeFooter.addEventListener('click', () => {
  getHome();
});

getHomeHeader.addEventListener('click', () => {
  getHome();
});

getHomeScore.addEventListener('click', () => {
  getHome();
});

getCategoryScore.addEventListener('click', () => {
  getScore();
});
getHomefromSettings.addEventListener('click', () => {
  getHome();
  document.querySelector('.settings-page').style.display = 'none';
});
getHomeFromQuestion.addEventListener('click', () => {
  getHome();
  document.querySelector('.questions-page').style.display = 'none';
});

categPage.addEventListener('click', (e) => {
  if (e.target.tagName == 'P') {
    scorePagePictures.innerHTML = '';
    categPage.style.display = 'none';
    scorePage.classList.remove('hidden');
    scorePage.style.display = 'block';
    let typeCategoryScore = e.target.parentElement.classList[1].split('_')[0];
    let numberCategoryScore = e.target.parentElement.classList[1].split('_')[1];
    let firstNumberScorePicture =
      typeCategoryScore == 'artist' ? numberCategoryScore * 10 : numberCategoryScore * 10 + 120;

    getImagesFromJson().then((res) => {
      for (let pos = firstNumberScorePicture; pos < firstNumberScorePicture + 10; pos++) {
        let imageSource = `https://raw.githubusercontent.com/lena-r-a/image-data/master/img/${res[pos].imageNum}.jpg`;
        let DIV = document.createElement('div');
        DIV.classList.add('score-picture');
        DIV.classList.add(`s${pos}`);
        let divText = `<div class="picture-info">
          <p class="info-title">${res[pos].name}</p>
          <p>${res[pos].author}, ${res[pos].year}</p>
          <div class="close-info">+</div>
        </div>`;
        DIV.innerHTML = divText;
        if (JSON.parse(localStorage.getItem('resultsArray'))[pos] == '1') {
          DIV.classList.add('rightAnswer');
          console.log(JSON.parse(localStorage.getItem('resultsArray'))[pos]);
        }

        let img = new Image();
        img.src = imageSource;
        img.onload = () => {
          DIV.style.backgroundImage = `url(${imageSource})`;
          scorePagePictures.append(DIV);
        };
      }
    });
  }
});

scorePage.addEventListener('click', (e) => {
  if (e.target.classList[0] == 'score-picture') {
    e.target.querySelector('.picture-info').style.display = 'block';
  } else if (e.target.classList[0] == 'close-info') {
    e.target.parentElement.style.display = 'none';
    console.log(e.target.parentElement);
  } else if (e.target.classList[1] == 'header-score_home') {
    getHome();
  } else if (e.target.classList[1] == 'header-score_categ') {
    getScore();
  } else return;
});
