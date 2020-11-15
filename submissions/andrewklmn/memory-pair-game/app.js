const files = [
  'image1.png',
  'image2.png',
  'image3.png',
  'image4.png',
  'image5.png',
  'image6.png',
  'image7.png',
  'image8.png',
];


const imageNames = [...files,...files];
const infoDiv = document.querySelector('.info');
const gameBoard = document.querySelector(".gameboard");
const controlDiv = document.querySelector('.control');
const startButton = document.querySelector('.start-btn');
const previewOption = document.querySelector('.preview-option');
const previewTime = 10;         /* time in sec */
const oneCardRemoveTime = 50;   /* time in ms */
const oneCardSpreadTime = 100;  /* time in ms */

let numberOfFails = 0; 

const getShuffledCards = function(list) { 
  return list.sort(() => Math.random() - 0.5); 
};

const openAllCards = function() {
  const cards = gameBoard.querySelectorAll('.flip-container');
  cards.forEach((c,i)=>{
    setTimeout(() => {
      c.classList.remove('guessed');
      c.classList.add('opened');      
    }, oneCardSpreadTime*i);
  })
};

const closeAllCards = function() {
  const cards = gameBoard.querySelectorAll('.flip-container');
  cards.forEach((c,i)=>{
    setTimeout(() => {
      c.classList.remove('guessed');
      c.classList.remove('opened');     
    }, oneCardSpreadTime*i);
  })
};

const removeAllCards = function () {
  const cards = getAllCards();
  cards.forEach((card,i)=>{
    setTimeout(()=>{
      card.remove();
    },(cards.length-i)*oneCardRemoveTime)
  });
  return cards.length*oneCardRemoveTime;
}

const initBoard = function () {
  const timeDelayForRemoving = removeAllCards();
  setTimeout(()=>{
    getShuffledCards(imageNames).forEach((image,i)=>{
      setTimeout(function () {
        const fragment = document.createDocumentFragment();
  
        const flipContainer = document.createElement('div');
        flipContainer.classList.add('flip-container');
        flipContainer.dataset.label = image;
  
        const flipper = document.createElement('div');
        flipper.classList.add('flipper');
  
        const front = document.createElement('div');
        front.classList.add('front');
  
        const frontImage = document.createElement('img');
        frontImage.classList.add('card');
        frontImage.src = 'img/empty.png';
        frontImage.alt = 'Back';
  
        front.appendChild(frontImage);
  
        const back = document.createElement('div');
        back.classList.add('back');
  
        const backImage = document.createElement('img');
        backImage.classList.add('card');
        backImage.src = `img/${image}`;
        backImage.alt = 'Image';
  
        back.appendChild(backImage);
        flipper.appendChild(front);
        flipper.appendChild(back);
        flipContainer.appendChild(flipper);
        fragment.appendChild(flipContainer);
  
        gameBoard.appendChild(fragment);
      },oneCardSpreadTime*i);
    });
  },timeDelayForRemoving);
  return timeDelayForRemoving + oneCardSpreadTime*imageNames.length;
}

const getAllCards = function() {
  return gameBoard.querySelectorAll('.flip-container');
}

const getOpenedCards = function() {
  return gameBoard.querySelectorAll('.opened:not(.guessed)');
}

const getGuessedCards = function() {
  return gameBoard.querySelectorAll('.guessed');
}

const showInfo = (text) => {
  infoDiv.innerHTML = text;
}

const cardClickListener = function(e) { 
  if (getOpenedCards().length == 16) return;
  const flipper = e.target.parentNode.parentNode.parentNode;
  controlDiv.classList.add('hide');
  
  if (!e.target.matches('.card')
      || flipper.matches('.guessed')) {
    return;
  } 
  if (getOpenedCards().length < 2) {
    if (!flipper.matches('.opened')) {
      flipper.classList.toggle('opened');
    };
  };
  
  const openedCards = getOpenedCards();
  if (openedCards.length == 2) {
    if (openedCards[0].dataset.label == openedCards[1].dataset.label) {
      setTimeout(()=>openedCards.forEach(c=>{
        c.classList.add('guessed');
      }),500);
      setTimeout(() => {
        if(getGuessedCards().length==16) {
          showInfo(`You won! Number of fails: ${numberOfFails}`);
          openAllCards();
          document.querySelector('.control').classList.remove('hide');
        };
      }, 700);
    } else {
      numberOfFails++;
      setTimeout(()=>openedCards.forEach(c=>c.classList.remove('opened')),500);
    };
  };
  if (numberOfFails>0) {
    showInfo(`Number of fails: ${numberOfFails}`);
  };
};

const countDown = (time)=>{
  showInfo(`Remember cards! Time left: ${time}`);
  for (let i=time; i>=1; i--) {
    setTimeout(()=>{
      showInfo(`Remember cards! Time left: ${(time-i)}`);
    },i*1000);
  };
}

const startButtonListener = function() {
  controlDiv.classList.add('hide');
  numberOfFails = 0;
  const timeout = initBoard();
  
  if (previewOption.checked) {    
    setTimeout(()=>{
      if (getOpenedCards().length == 0) {
        openAllCards();
      };

      countDown(previewTime);

      setTimeout(()=>{
        closeAllCards();
        showInfo(`And now try to guess!`);
      },1000*previewTime);

    },timeout);
  } else {
    setTimeout(()=>{
      showInfo(`Try to guess!`);
    },timeout);
  };
};

const init = function() {
  showInfo('Welcome to Memory Pairs Game');

  initBoard();
  
  setTimeout(()=>{
    gameBoard.addEventListener('click',cardClickListener);
    startButton.addEventListener('click', startButtonListener);
  }, oneCardSpreadTime*imageNames.length);
}

document.addEventListener('DOMContentLoaded', ()=>{  
  init();
});
