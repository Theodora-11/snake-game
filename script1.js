const gameBoard = document.querySelector('.game-board');
let text = document.querySelector('.text');
let logo = document.querySelector('.logo');
let highScoreText = document.querySelector('.high-score');
let score = document.querySelector('.score');

const eatSound = document.querySelector('.eat-sound');
const gameOverSound = document.querySelector('.game-over-sound');
let gameBoardSize = 21;
let snake = [{x: 10, y: 10}];
let snakeSpeed = 200;
let gameStart = false;
let food = generateFood(); 
let direction = 'right';
let gameInterval;
let highScore = 0;
let last = 0;
let cancelAnimation;


document.addEventListener('keydown', startGame);

function startGame(event) {
  if (event.key === ' ' || 
    event.code === 'Space' && 
    gameStart === false) {

    cancelAnimation = requestAnimationFrame(animation);
    document.removeEventListener('keydown', startGame);
    gameStart = true;
  } 
}

let colors = [
  'rgba(10, 184, 193, 0.69)',
  'rgba(210, 135, 212, 0.69)',
  'rgba(26, 130, 209, 0.69)', 
  'rgba(193, 10, 132, 0.69)'
]

function getColor() {
  let colorsRandom = Math.floor(Math.random() * colors.length);
  return colorsRandom;
}


function animation(time) {
  if(time - last >= snakeSpeed)  {
    last = time;
    moveSnake();
    draw();
    collision();
  }

  cancelAnimation = requestAnimationFrame(animation);
  if(gameStart === false) {
    cancelAnimationFrame(cancelAnimation);
  }
}


function draw() {
  gameBoard.innerHTML = '';
  createSnake();
  createFood();
}


function createSnake() {
  snake.forEach(segment => {
    const snakeElement = document.createElement('div');
    snakeElement.classList.add('snake');
    gameBoard.appendChild(snakeElement);
    snakeElement.style.gridColumn = segment.x;
    snakeElement.style.gridRow = segment.y;
    return snakeElement;
  })
}


function createFood() {
  let foodElement = document.createElement('div');
  foodElement.classList.add('food');
  gameBoard.appendChild(foodElement);
  foodPosition(foodElement, food);
}


function generateFood() {
  const x = Math.floor((Math.random() * gameBoardSize) + 1);
  const y = Math.floor((Math.random() * gameBoardSize) + 1);
  const food = {x, y};

  snake.forEach(segment => {
    if(food.x === segment.x && food.y === segment.y) {
      const x = Math.floor((Math.random() * gameBoardSize) + 1);
      const y = Math.floor((Math.random() * gameBoardSize) + 1);
    }
  })

  return food;
}


function foodPosition(element, position) {
  element.style.gridColumn = position.x;
  element.style.gridRow = position.y;
}


function moveSnake() {
  let head = {...snake[0]};
  
  switch(direction) {
    case 'up': 
      head.y--;
      break;
    case 'down':
      head.y++;
      break;
    case 'right':
      head.x++;
      break;
    case 'left':
      head.x--;
      break;
  } 

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    eatSound.play();
    food = generateFood();
    increaseSpeed();
    let currentScore = snake.length - 1;
    score.innerHTML = currentScore.toString().padStart(3, '0'); 
  } else {
    snake.pop();
  }
}


function increaseSpeed() {
  if(snakeSpeed <= 190) {
    if(getColor() === 0 || 
    getColor() === 1 || 
    getColor() === 2 || 
    getColor() === 3) {
      let numberColor = getColor();
      gameBoard.style.outline = `30px ridge ${colors[numberColor]}`;
    }

    if(typeof createSnake() === 'undefined') {
      snake.forEach(segment => {
        let colorSnake = getColor();
        segment = document.createElement('div');
        segment.setAttribute('class', 'snake');
        gameBoard.appendChild(segment);
        segment.style.background = colors[colorSnake];
        console.log(segment);
      })
    }
  }
     
  if(snakeSpeed <= 200) {
    snakeSpeed -= 5;
    // console.log(snakeSpeed); 
  } else if(snakeSpeed >= 150) {
    snakeSpeed -= 4;
  } else if(snakeSpeed >= 100) {
    snakeSpeed -= 3;
  } else if(snakeSpeed >= 50) {
    snakeSpeed -= 2;
  } else if(snakeSpeed >= 25) {
    snakeSpeed -= 1;
    
  }
}


function collision() {
  const head = snake[0];
  if (head.x < 1 || 
    head.x > gameBoardSize || 
    head.y < 1 || 
    head.y > gameBoardSize) {
    gameOverSound.play();
    gameOver();
  } 

  for( let i = 1; i < snake.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
      gameOverSound.play();
      gameOver();
    }
  }
}


function heightScore() {
  let currentScore = snake.length - 1;
  if (currentScore > highScore) {    
    highScore = currentScore;
    highScoreText.innerHTML = highScore.toString().padStart(3, '0');
  } 
}

let lastDirection = 'right';
function presArrowKey(event) {
  
  switch(event.code) {
    case 'ArrowUp':
      if(lastDirection === 'down') break;
      direction = 'up';
      lastDirection = direction;
      break;
    case 'ArrowRight':
      if(lastDirection === 'left') break;
      direction = 'right';
      lastDirection = direction;
      break;
    case 'ArrowDown':
      if(lastDirection === 'up') break;
      direction = 'down';
      lastDirection = direction;
      break;
    case 'ArrowLeft':
      if(lastDirection === 'right') break;
      direction = 'left';
      lastDirection = direction;
      break;
  }
}


document.addEventListener('keyup', presArrowKey);

function reset() {
  gameStart = false;
  gameBoard.innerHTML = "";
  let newLogo = document.createElement('img');
  newLogo.classList.add('logo');
  newLogo.setAttribute('src', 'snake.png');

  let newText = document.createElement('h1');
  newText.classList.add('new-text');
  newText.innerHTML = 'You lost the game!';

  let textPressSpace = document.createElement('h1');
  textPressSpace.classList.add('press-text');
  textPressSpace.innerHTML = 'Press spacebar to start the game!';

  gameBoard.appendChild(textPressSpace);
  gameBoard.appendChild(newLogo);
  gameBoard.appendChild(newText);
}


