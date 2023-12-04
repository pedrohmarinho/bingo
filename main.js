const generateButton = document.getElementById('generate-board');
const generateAllButton = document.getElementById('generate-all-numbers');
const restartButton = document.getElementById('restart-game');
const board = document.getElementById('bingo-board');
const playersContainer = document.getElementById('players-container');

let numbersCalled = [];
let players = [];
let canStartGame = false;

function toggleStartButton() {
  generateAllButton.style.display = canStartGame ? 'block' : 'none';
}

function generateRandomNumber(usedNumbers) {
  let number;
  do {
    number = Math.floor(Math.random() * 75) + 1;
  } while (usedNumbers.includes(number));
  return number;
}

function generateBoard(player) {
  const playerBoard = document.getElementById(`player${player.id}-board`);
  playerBoard.innerHTML = '';
  const usedNumbers = [];

  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      const square = document.createElement('div');
      square.className = 'board-item';

      if (i === 2 && j === 2) {
        square.className += ' center-cell';
        square.innerText = 'X';
      } else {
        const number = generateRandomNumber(usedNumbers);
        usedNumbers.push(number);
        square.innerText = number;
      }

      playerBoard.appendChild(square);
    }
  }

  canStartGame = true;
  toggleStartButton();
}

function toggleActiveSquare(square) {
  square.classList.toggle('active');
}

function checkWinner(player) {
  const playerBoard = document.getElementById(`player${player.id}-board`);
  const squares = playerBoard.querySelectorAll('.board-item');
  const markedSquares = Array.from(squares).filter((square) =>
    square.classList.contains('active')
  );

  return markedSquares.length === 24;
}

function checkForWinner() {
  const winners = [];
  for (let i = 0; i < players.length; i++) {
    if (checkWinner(players[i])) {
      winners.push(players[i].name);
    }
  }

  if (winners.length > 0) {
    alert(`Parabéns, ${winners.join(' e ')}! Vocês ganharam o jogo!`);
    restartAndBackToHome();
    return true;
  }

  return false;
}

function generateAllNumbers() {
  if (numbersCalled.length === 75) {
    alert('Todos os números já foram chamados. Fim de jogo!');
    restartAndBackToHome();
  } else {
    const table = document.getElementById('called-numbers');
    const intervalId = setInterval(() => {
      if (checkForWinner()) {
        clearInterval(intervalId);
        return;
      }

      const number = generateRandomNumber(numbersCalled);
      numbersCalled.push(number);

      if (table.rows.length === 0 || table.rows[table.rows.length - 1].cells.length >= 12) {
        const newRow = table.insertRow(-1);
      }

      const newRow = table.rows[table.rows.length - 1];
      const cell = newRow.insertCell(-1);
      cell.innerHTML = number;

      players.forEach(player => {
        const squares = document.querySelectorAll(`#player${player.id}-board .board-item`);
        squares.forEach((square) => {
          if (parseInt(square.innerText) === number) {
            toggleActiveSquare(square);
          }
        });
      });

      if (numbersCalled.length === 75) {
        alert('Todos os números foram chamados!');
        clearInterval(intervalId);
        restartAndBackToHome();
      }
    }, 300);
  }
}

function restartAndBackToHome() {
  location.reload();
  generateAllButton.style.display = 'none'; // Oculta o botão ao reiniciar o jogo
}

function initializeGame() {
  const numPlayers = prompt('Digite o número de jogadores (entre 2 e 4):');

  if (numPlayers >= 2 && numPlayers <= 4) {
    for (let i = 1; i <= numPlayers; i++) {
      const playerName = prompt(`Digite o nome do jogador ${i}:`);
      const player = { id: i, name: playerName };
      players.push(player);
      const playerDiv = document.createElement('div');
      playerDiv.className = 'player';
      playerDiv.innerHTML = `
        <h2>${playerName}</h2>
        <div id="player${i}-board" class="player-board"></div>
      `;
      playersContainer.appendChild(playerDiv);
      generateBoard(player);
    }
    generateButton.disabled = true;
  } else {
    alert('Número de jogadores inválido. O jogo requer entre 2 e 4 jogadores.');
  }
}

generateButton.addEventListener('click', initializeGame);
generateAllButton.addEventListener('click', generateAllNumbers);
restartButton.addEventListener('click', restartAndBackToHome);
