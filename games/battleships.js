const boardSize = 6;
const numShips = 5;
let boards = [[], []];
let hits = [0, 0];
let attempts = [0, 0];
let currentPlayer = 0;
let gameOver = false;

function initGame() {
  const board1 = document.getElementById("board1");
  const board2 = document.getElementById("board2");
  board1.innerHTML = "";
  board2.innerHTML = "";

  boards = [[], []];
  hits = [0, 0];
  attempts = [0, 0];
  currentPlayer = 0;
  gameOver = false;
  document.getElementById("status").textContent = "Player 1's turn";
  for (let p = 0; p < 2; p++) {
    while (boards[p].length < numShips) {
      const pos = Math.floor(Math.random() * boardSize * boardSize);
      if (!boards[p].includes(pos)) {
        boards[p].push(pos);
      }
    }
  }
  for (let i = 0; i < boardSize * boardSize; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.addEventListener("click", () => handleClick(cell, i, 1));
    board1.appendChild(cell);
  }
  for (let i = 0; i < boardSize * boardSize; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.addEventListener("click", () => handleClick(cell, i, 0));
    board2.appendChild(cell);
  }
}
function handleClick(cell, index, targetPlayer) {
  if (gameOver) return;
  if (currentPlayer === targetPlayer) return;
  if (cell.classList.contains("hit") || cell.classList.contains("miss")) return;
  attempts[currentPlayer]++;
  if (boards[targetPlayer].includes(index)) {
    cell.classList.add("hit");
    cell.textContent = "💥";
    hits[currentPlayer]++;
  } else {
    cell.classList.add("miss");
    cell.textContent = "🌊";
  }
  if (hits[currentPlayer] === numShips) {
    document.getElementById("status").textContent = `Player ${currentPlayer + 1} wins in ${attempts[currentPlayer]} attempts! 🎉`;
    gameOver = true;
    return;
  }
  currentPlayer = 1 - currentPlayer;
  document.getElementById("status").textContent = `Player ${currentPlayer + 1}'s turn`;
}
window.onload = initGame;
