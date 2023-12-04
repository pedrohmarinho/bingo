const generateButton = document.getElementById('generate-board');
const generateAllButton = document.getElementById('generate-all-numbers');
const restartButton = document.getElementById('restart-game');
const board = document.getElementById('bingo-board');
const playersContainer = document.getElementById('players-container');

let numbersCalled = [];
let players = [];

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

function checkWinner(player) {
  const playerBoard = document.getElementById(`player${player.id}-board`);
  const squares = playerBoard.querySelectorAll('.board-item');
  const markedSquares = Array.from(squares).filter((square) =>
    square.classList.contains('active')
  );

  return markedSquares.length === 24;
}

function checkForWinner() {
  for (let i = 0; i < players.length; i++) {
    if (checkWinner(players[i])) {
      alert(`Parabéns, ${players[i].name}! Você ganhou o jogo!`);
      restartAndBackToHome();
      return true;
    }
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

      const newRow = table.insertRow(-1);
      const cell1 = newRow.insertCell(0);
      cell1.innerHTML = number;

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
    }, 200); // Intervalo de 700 milissegundos (0.7 segundos) entre cada número
  }
}

function restartAndBackToHome() {
  location.reload();
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
