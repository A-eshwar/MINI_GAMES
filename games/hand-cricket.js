document.addEventListener('DOMContentLoaded', () => {
  const btnBat = document.getElementById("btnBat");
  const btnBowl = document.getElementById("btnBowl");
  const btnAuto = document.getElementById("btnAuto");
  const choiceArea = document.getElementById("choiceArea");
  const choices = Array.from(document.querySelectorAll(".choice"));
  const statusText = document.getElementById("statusText");
  const inningsEl = document.getElementById("innings");
  const playerRunsEl = document.getElementById("playerRuns");
  const compRunsEl = document.getElementById("compRuns");
  const targetEl = document.getElementById("target");
  const lastPlayer = document.getElementById("lastPlayer");
  const lastComp = document.getElementById("lastComp");
  const lastOutcome = document.getElementById("lastOutcome");
  const displayPlayer = document.getElementById("displayPlayer");
  const displayComp = document.getElementById("displayComp");
  const gameLog = document.getElementById("gameLog");
  const modeLabel = document.getElementById("modeLabel");
  const btnRestart = document.getElementById("btnRestart");
  const btnPeek = document.getElementById("btnPeek");
  let innings = 0;
  let playerRuns = 0;
  let compRuns = 0;
  let playerBattedFirst = null;
  let allowChoices = false;
  let gameOver = false;
  let autoMode = false;
  const rnd = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  function log(text) {
    const d = document.createElement("div");
    d.textContent = text;
    gameLog.prepend(d);
  }
  function updateDisplay() {
    inningsEl.textContent = innings;
    playerRunsEl.textContent = playerRuns;
    compRunsEl.textContent = compRuns;
    displayPlayer.textContent = playerRuns;
    displayComp.textContent = compRuns;
    if (innings === 2) {
      targetEl.textContent = playerBattedFirst ? playerRuns + 1 : compRuns + 1;
    } else {
      targetEl.textContent = "-";
    }
    let modeText = "Idle";
    if (innings === 1) modeText = playerBattedFirst ? "You batting" : "You bowling";
    if (innings === 2) modeText = playerBattedFirst ? "You bowling (chase)" : "You batting (chase)";
    modeLabel.textContent = modeText;
  }
  function resetGame() {
    innings = 0;
    playerRuns = 0;
    compRuns = 0;
    playerBattedFirst = null;
    allowChoices = false;
    gameOver = false;
    autoMode = false;
    lastPlayer.textContent = "-";
    lastComp.textContent = "-";
    lastOutcome.textContent = "-";
    gameLog.innerHTML = "<div><i>Game log will appear here...</i></div>";
    choiceArea.style.display = "none";
    btnAuto.textContent = "Auto-mode: Computer bats";
    btnAuto.classList.remove("active");
    btnBat.disabled = false;
    btnBowl.disabled = false;
    btnAuto.disabled = false;
    choices.forEach((c) => c.classList.remove("hit", "miss"));
    statusText.textContent = "Choose to Bat or Bowl to start";
    updateDisplay();
  }
  function startGame(playerStartsBat) {
    playerBattedFirst = playerStartsBat;
    innings = 1;
    playerRuns = 0;
    compRuns = 0;
    gameOver = false;
    allowChoices = true;
    choiceArea.style.display = "block";
    btnBat.disabled = true;
    btnBowl.disabled = true;
    btnAuto.disabled = true;
    statusText.textContent = playerBattedFirst
      ? "Innings 1: You are batting. Pick 1-6."
      : "Innings 1: You are bowling. Pick 1-6.";
    log(`Innings 1 started. ${playerBattedFirst ? "You bat first." : "You bowl first."}`);
    updateDisplay();
  }
  btnBat.addEventListener("click", () => startGame(true));
  btnBowl.addEventListener("click", () => startGame(false));
  btnAuto.addEventListener("click", () => {
    autoMode = !autoMode;
    btnAuto.classList.toggle("active");
    btnAuto.textContent = autoMode ? "Auto-mode: ON" : "Auto-mode: Computer bats";
    alert("Auto-mode toggled: " + (autoMode ? "ON" : "OFF") + ". Core play remains clicking numbers each ball.");
  });
  choices.forEach((c) => {
    c.addEventListener("click", () => {
      if (!allowChoices || gameOver) return;
      handleChoice(Number(c.dataset.val), c);
    });
  });
  function handleChoice(val, elem) {
    allowChoices = false;
    choices.forEach((x) => x.classList.remove("hit", "miss"));
    const compPick = rnd(1, 6);
    lastPlayer.textContent = val;
    lastComp.textContent = compPick;
    if (innings === 1) {
      if (playerBattedFirst) {
        if (val === compPick) {
          elem.classList.add("miss");
          lastOutcome.textContent = "WICKET";
          log(`Ball: You ${val} vs Comp ${compPick} → WICKET! Your innings ended at ${playerRuns} runs.`);
          setTimeout(endFirstInnings, 350);
        } else {
          playerRuns += val;
          elem.classList.add("hit");
          lastOutcome.textContent = `+${val}`;
          log(`Ball: You ${val} vs Comp ${compPick} → +${val} (Total: ${playerRuns})`);
          updateDisplay();
          setTimeout(() => (allowChoices = true), 250);
        }
      } else {
        if (val === compPick) {
          elem.classList.add("miss");
          lastOutcome.textContent = "WICKET";
          log(`Ball: You ${val} vs Comp ${compPick} → WICKET! Computer innings ended at ${compRuns} runs.`);
          setTimeout(endFirstInnings, 350);
        } else {
          compRuns += compPick;
          elem.classList.add("hit");
          lastOutcome.textContent = `Comp +${compPick}`;
          log(`Ball: You ${val} vs Comp ${compPick} → Comp +${compPick} (Total: ${compRuns})`);
          updateDisplay();
          setTimeout(() => (allowChoices = true), 250);
        }
      }
    } else if (innings === 2) {
      if (playerBattedFirst) {
        if (val === compPick) {
          elem.classList.add("miss");
          lastOutcome.textContent = "WICKET";
          log(`Ball: You ${val} vs Comp ${compPick} → WICKET! Computer all out at ${compRuns} runs.`);
          setTimeout(endGame, 350);
        } else {
          compRuns += compPick;
          elem.classList.add("hit");
          lastOutcome.textContent = `Comp +${compPick}`;
          log(`Ball: You ${val} vs Comp ${compPick} → Comp +${compPick} (Total: ${compRuns})`);
          updateDisplay();
          if (compRuns >= playerRuns + 1) {
            setTimeout(() => {
              log(`Computer chased target! ${compRuns} to ${playerRuns}`);
              endGame();
            }, 250);
          } else {
            setTimeout(() => (allowChoices = true), 250);
          }
        }
      } else {
        if (val === compPick) {
          elem.classList.add("miss");
          lastOutcome.textContent = "WICKET";
          log(`Ball: You ${val} vs Comp ${compPick} → WICKET! Your innings ended at ${playerRuns} runs.`);
          setTimeout(endGame, 350);
        } else {
          playerRuns += val;
          elem.classList.add("hit");
          lastOutcome.textContent = `+${val}`;
          log(`Ball: You ${val} vs Comp ${compPick} → +${val} (Total: ${playerRuns})`);
          updateDisplay();
          if (playerRuns >= compRuns + 1) {
            setTimeout(() => {
              log(`You chased the target! ${playerRuns} to ${compRuns}`);
              endGame();
            }, 250);
          } else {
            setTimeout(() => (allowChoices = true), 250);
          }
        }
      }
    }
  }
  function endFirstInnings() {
    innings = 2;
    allowChoices = true;
    choiceArea.style.display = "block";
    if (playerBattedFirst) {
      statusText.textContent = `Second innings: You are bowling. Target for Computer: ${playerRuns + 1}`;
      log(`End of innings 1. Player scored ${playerRuns}. Target for Computer: ${playerRuns + 1}`);
    } else {
      statusText.textContent = `Second innings: You are batting. Target for You: ${compRuns + 1}`;
      log(`End of innings 1. Computer scored ${compRuns}. Target for Player: ${compRuns + 1}`);
    }
    updateDisplay();
  }
  function endGame() {
    gameOver = true;
    allowChoices = false;
    choiceArea.style.display = "none";
    let result = "";
    if (playerRuns > compRuns) result = `You win! ${playerRuns} to ${compRuns}`;
    else if (compRuns > playerRuns) result = `Computer wins! ${compRuns} to ${playerRuns}`;
    else result = `It's a tie: ${playerRuns} - ${compRuns}`;
    statusText.textContent = result;
    log("---- Game Over ----");
    log(result);
    updateDisplay();
    btnBat.disabled = false;
    btnBowl.disabled = false;
    btnAuto.disabled = false;
  }
  btnRestart.addEventListener("click", () => {
    if (confirm("Restart the game?")) resetGame();
  });
  btnPeek.addEventListener("click", () => {
    if (innings === 0) alert("You haven't started yet. Choose Bat or Bowl.");
    else alert(`Innings: ${innings}\nPlayer runs: ${playerRuns}\nComputer runs: ${compRuns}\nMode: ${modeLabel.textContent}`);
  });
  resetGame();
});