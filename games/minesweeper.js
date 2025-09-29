const rows = 10, cols = 10, minesCount = 15;
let board = [];
let gameOver = false;

function initGame() {
  const boardEl = document.getElementById("board");
  const statusEl = document.getElementById("status");
  boardEl.innerHTML = "";
  statusEl.textContent = "";
  gameOver = false;

  board = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({ mine: false, revealed: false, flagged: false, count: 0 }))
  );

  // Place mines
  let placed = 0;
  while (placed < minesCount) {
    let r = Math.floor(Math.random() * rows);
    let c = Math.floor(Math.random() * cols);
    if (!board[r][c].mine) {
      board[r][c].mine = true;
      placed++;
    }
  }

  // Count neighbors
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c].mine) continue;
      board[r][c].count = getNeighbors(r, c).filter(n => board[n.r][n.c].mine).length;
    }
  }

  // Render cells
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cellEl = document.createElement("div");
      cellEl.className = "cell";
      cellEl.addEventListener("click", () => reveal(r, c));
      cellEl.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        toggleFlag(r, c);
      });
      boardEl.appendChild(cellEl);
      board[r][c].el = cellEl;
    }
  }
}

function getNeighbors(r, c) {
  const dirs = [-1, 0, 1];
  let neighbors = [];
  for (let dr of dirs) {
    for (let dc of dirs) {
      if (dr === 0 && dc === 0) continue;
      let nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
        neighbors.push({ r: nr, c: nc });
      }
    }
  }
  return neighbors;
}

function reveal(r, c) {
  if (gameOver || board[r][c].revealed || board[r][c].flagged) return;

  const cell = board[r][c];
  cell.revealed = true;
  cell.el.classList.add("revealed");

  if (cell.mine) {
    cell.el.textContent = "💣";
    cell.el.classList.add("mine");
    gameOver = true;
    document.getElementById("status").textContent = "💥 Game Over!";
    revealAll();
    return;
  }

  if (cell.count > 0) {
    cell.el.textContent = cell.count;
  } else {
    getNeighbors(r, c).forEach(n => reveal(n.r, n.c));
  }

  checkWin();
}

function toggleFlag(r, c) {
  if (gameOver || board[r][c].revealed) return;
  const cell = board[r][c];
  cell.flagged = !cell.flagged;
  cell.el.textContent = cell.flagged ? "🚩" : "";
  cell.el.classList.toggle("flagged", cell.flagged);
}

function revealAll() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = board[r][c];
      if (cell.mine) {
        cell.el.textContent = "💣";
        cell.el.classList.add("mine");
      }
    }
  }
}

function checkWin() {
  let revealedCount = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c].revealed) revealedCount++;
    }
  }
  if (revealedCount === rows * cols - minesCount) {
    document.getElementById("status").textContent = "🎉 You Win!";
    gameOver = true;
    revealAll();
  }
}
initGame();