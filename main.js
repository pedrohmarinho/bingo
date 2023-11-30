const generateButton = document.getElementById('generate-board');
const callButton = document.getElementById('call-number');
const generateAllButton = document.getElementById('generate-all-numbers');
const restartButton = document.getElementById('restart-game');
const board = document.getElementById('bingo-board');
const player1Board = document.getElementById('player1-board');
const player2Board = document.getElementById('player2-board');

let numbersCalled = [];
let currentPlayer = 1;

function generateRandomNumber(usedNumbers) {
  let number;
  do {
    number = Math.floor(Math.random() * 75) + 1;
  } while (usedNumbers.includes(number));
  return number;
}

function generateBoard(playerBoard) {
  playerBoard.innerHTML = '';
  const usedNumbers = [];
  for (let i = 0; i < 24; i++) {
    const square = document.createElement('div');
    square.className = 'board-item';
    const number = generateRandomNumber(usedNumbers);
    usedNumbers.push(number);
    square.innerText = number;
    playerBoard.appendChild(square);
  }
}

function toggleActiveSquare(square) {
  square.classList.toggle('active');
}

function checkWinner(playerBoard, playerName) {
  const squares = playerBoard.querySelectorAll('.board-item');
  const markedSquares = Array.from(squares).filter((square) =>
    square.classList.contains('active')
  );

  if (markedSquares.length === 24) {
    alert(`Parabéns, ${playerName}! Você ganhou o jogo!`);
    restartGame();
  }
}

function callNumber() {
  const number = generateRandomNumber(numbersCalled);
  numbersCalled.push(number);
  alert(`Número chamado: ${number}`);

  const squares = document.querySelectorAll('.board-item');
  squares.forEach((square) => {
    if (parseInt(square.innerText) === number) {
      toggleActiveSquare(square);
    }
  });

  checkWinner(player1Board, 'Jogador 1');
  checkWinner(player2Board, 'Jogador 2');

  switchPlayer();
}

function generateAllNumbers() {
  if (numbersCalled.length === 75) {
    alert('Todos os números já foram chamados. Fim de jogo!');
    restartGame();
  } else {
    for (let i = numbersCalled.length + 1; i <= 75; i++) {
      numbersCalled.push(i);
    }
    alert('Todos os números foram chamados!');
    checkWinner(player1Board, 'Jogador 1');
    checkWinner(player2Board, 'Jogador 2');
    switchPlayer();
  }
}

function switchPlayer() {
  currentPlayer = currentPlayer === 1 ? 2 : 1;
}

function restartGame() {
  generateBoard(player1Board);
  generateBoard(player2Board);
  numbersCalled = [];
  currentPlayer = 1;
}

generateButton.addEventListener('click', () => {
  restartGame();
});

callButton.addEventListener('click', () => {
  if (numbersCalled.length < 75) {
    callNumber();
  } else {
    alert('Todos os números já foram chamados. Fim de jogo!');
    restartGame();
  }
});

generateAllButton.addEventListener('click', () => {
  generateAllNumbers();
});

restartButton.addEventListener('click', () => {
  restartGame();
});
