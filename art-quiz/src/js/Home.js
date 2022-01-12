const artistBtn = document.querySelector('.btn_artist');
const pictureBtn = document.querySelector('.btn_picture');
const homePage = document.querySelector('.home-page');
const footer = document.querySelector('.footer');
const categoryPage = document.querySelector('.category-page');
const categoryContainer = document.querySelector('.category-page__container');
const settingsPage = document.querySelector('.settings-page');
let typeCategory;

homePage.addEventListener('click', (e) => {
  e.stopPropagation();
  e.preventDefault();
  if (e.target.classList.contains('btn_artist')) {
    typeCategory = 'artist';
    categoryContainer.innerHTML = '';
    homePageButtonClick(typeCategory);
  } else if (e.target.classList.contains('btn_picture')) {
    categoryContainer.innerHTML = '';
    typeCategory = 'picture';
    homePageButtonClick(typeCategory);
  } else if (e.target.classList.contains('settins-ikon')) {
    homePage.classList.add('hidden');
    setTimeout(() => {
      settingsPage.style.display = 'block';
      homePage.style.display = 'none';
      settingsPage.classList.remove('hidden');
    }, 400);
  } else return;
});

const homePageButtonClick = (type) => {
  homePage.classList.add('hidden');
  footer.classList.add('hidden');
  homePage.style.display = 'none';
  footer.style.display = 'none';
  setTimeout(() => {
    categoryPage.classList.remove('hidden');
    categoryPage.style.display = 'block';
    for (let i = 0; i < 12; i++) {
      createCategory(type, i, categoryContainer);
    }
  }, 400);
};

const createCategory = (type, number, container) => {
  const DIV = document.createElement('div');
  DIV.classList.add('category-div');
  DIV.classList.add(`${type}_${number}`);
  DIV.classList.add(`${type}`);

  const content = `<h3 class="category-div__title ${type}_${number}">${String(number + 1).padStart(
    2,
    '0'
  )}</h3> 
                    <p class="category-div__result-${number}"></p>`;
  DIV.innerHTML = content;
  const img = new Image();
  let imgSRC;
  if (type == 'artist') {
    imgSRC = `https://raw.githubusercontent.com/lena-r-a/image-data/master/img/${number * 10}.jpg`;
  } else {
    imgSRC = `https://raw.githubusercontent.com/lena-r-a/image-data/master/img/${
      number * 10 + 120
    }.jpg`;
  }
  img.src = imgSRC;
  img.onload = () => {
    DIV.style.backgroundImage = `url(${imgSRC})`;
  };
  container.append(DIV);

  if (type == 'artist' && localStorage.getItem('totalResultArray')) {
    let arrayWithResults = JSON.parse(localStorage.getItem('totalResultArray'));
    if (arrayWithResults[number]) {
      document.querySelector(
        `.category-div__result-${number}`
      ).innerHTML = `Score: ${arrayWithResults[number]}/10`;
      document
        .querySelector(`.category-div__result-${number}`)
        .parentElement.classList.add('finishedGame');
    }
  }
  if (type == 'picture' && localStorage.getItem('totalResultArrayPicture')) {
    let arrayWithResults = JSON.parse(localStorage.getItem('totalResultArrayPicture'));
    if (arrayWithResults[number]) {
      document.querySelector(
        `.category-div__result-${number}`
      ).innerHTML = `Score: ${arrayWithResults[number]}/10`;
      document
        .querySelector(`.category-div__result-${number}`)
        .parentElement.classList.add('finishedGame');
    }
  }
};
