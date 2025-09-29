const sentences = [
      "The quick brown fox jumps over the lazy dog. Typing speed tests are fun and help you improve your accuracy while practicing daily.",
      "JavaScript is a versatile programming language. It powers interactive websites and is widely used in web development and even in game design.",
      "Stay curious and keep exploring new things. Consistent practice and curiosity are the keys to mastering programming and problem solving.",
      "Technology is evolving rapidly, and learning to adapt is one of the most important skills. The more you experiment, the more confident you will become.",
      "Programming is not just about writing code; it is about solving problems and building solutions that can impact people's lives in meaningful ways.",
      "Reading books and articles daily expands your knowledge and improves your concentration. Just like typing practice, small efforts bring big results.",
      "Every expert was once a beginner. The difference between success and failure is the ability to keep going even when things seem difficult."
    ];

    const sentenceEl = document.getElementById("sentence");
    const inputEl = document.getElementById("input");
    const resultEl = document.getElementById("result");
    const startBtn = document.getElementById("startBtn");
    const timerEl = document.getElementById("timer");

    let startTime, timerInterval, currentSentence;

    function startTest() {
      // Pick a random sentence
      currentSentence = sentences[Math.floor(Math.random() * sentences.length)];
      sentenceEl.textContent = currentSentence;
      inputEl.value = "";
      inputEl.disabled = false;
      inputEl.focus();
      resultEl.textContent = "";
      startBtn.disabled = true;
      startBtn.textContent = "Running...";
      startTime = null;
      timerEl.textContent = "⏱️ Time: 0s";
      clearInterval(timerInterval);
    }

    inputEl.addEventListener("input", function() {
      if (!startTime) {
        startTime = new Date();
        let seconds = 0;
        timerInterval = setInterval(() => {
          seconds++;
          timerEl.textContent = `⏱️ Time: ${seconds}s`;
        }, 1000);
      }
      if (inputEl.value === currentSentence) {
  const endTime = new Date();
  clearInterval(timerInterval);
  const timeTaken = (endTime - startTime) / 1000;

  resultEl.textContent = `🎉 You completed the task in ${timeTaken.toFixed(2)} seconds!`;

  inputEl.disabled = true;
  startBtn.disabled = false;
  startBtn.textContent = "Restart Test";
}
    });

    startBtn.addEventListener("click", startTest);