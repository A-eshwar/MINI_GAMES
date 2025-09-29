const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const restartBtn = document.getElementById("restart");

let currentPlayer = "X";
let board = ["", "", "", "", "", "", "", "", ""];
let gameActive = true;

const winningCombinations = [
  [0,1,2], [3,4,5], [6,7,8], 
  [0,3,6], [1,4,7], [2,5,8], 
  [0,4,8], [2,4,6]          
];

function handleClick(e) {
  const index = e.target.dataset.index;
  if (board[index] !== "" || !gameActive) return;

  board[index] = currentPlayer;
  e.target.classList.add(currentPlayer);
  e.target.textContent = currentPlayer;

  const winningCombo = checkWinner();
  if (winningCombo) {
    statusText.textContent = `🎉 Player ${currentPlayer} Wins!`;
    highlightWinner(winningCombo);
    gameActive = false;
  } else if (!board.includes("")) {
    statusText.textContent = "😮 It's a Draw!";
    gameActive = false;
  } else {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusText.textContent = `Player ${currentPlayer}'s turn`;
  }
}

function checkWinner() {
  for (let combo of winningCombinations) {
    if (combo.every(index => board[index] === currentPlayer)) {
      return combo;
    }
  }
  return null;
}

function highlightWinner(combo) {
  combo.forEach(index => {
    cells[index].classList.add("winner");
  });
}
function restartGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  gameActive = true;
  currentPlayer = "X";
  statusText.textContent = "Player X's turn";
  cells.forEach(cell => {
    cell.textContent = "";
    cell.classList.remove("X", "O", "winner");
  });
}
cells.forEach(cell => cell.addEventListener("click", handleClick));
restartBtn.addEventListener("click", restartGame);
