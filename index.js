const startBtn = document.getElementById("start-btn");
const restartBtn = document.getElementById("restart-btn");
const quizContainer = document.getElementById("quiz-container");
const startScreen = document.getElementById("start-screen");
const scoreScreen = document.getElementById("score-screen");
const questionText = document.getElementById("question-text");
const answersContainer = document.getElementById("answers");
const scoreDisplay = document.getElementById("score");
const scorePoints = document.getElementById("score-points");
const timerDisplay = document.getElementById("timer");
const nextBtn = document.getElementById("next-btn");
const prevBtn = document.getElementById("prev-btn");
const progressBar = document.getElementById('progressBar');

let questions = [];
let currentIndex = 0;
let score = 0;
let timer;
let timeLeft = 5;

// Button Event Listeners
startBtn.addEventListener("click", startQuiz);
restartBtn.addEventListener("click", () => location.reload());
nextBtn.addEventListener("click", () => changeQuestion(1));
prevBtn.addEventListener("click", () => changeQuestion(-1));

function startQuiz() {
  startScreen.classList.add("hidden");
  quizContainer.classList.remove("hidden");
  fetch("https://opentdb.com/api.php?amount=10&category=9&difficulty=medium&type=multiple")
    .then(res => res.json())
    .then(data => {
      questions = data.results.map(q => ({
        question: q.question,
        correct: q.correct_answer,
        answers: shuffle([...q.incorrect_answers, q.correct_answer])
      }));
      displayQuestion();
      startTimer();
    });
}

function displayQuestion() {
  resetTimer();
  const current = questions[currentIndex];
  const progress = (currentIndex / questions.length) * 100;
  progressBar.style.width = `${progress}%`;
  questionText.innerHTML = `Q${currentIndex + 1}: ${current.question}`;
  answersContainer.innerHTML = "";

  current.answers.forEach(answer => {
    const btn = document.createElement("button");
    btn.innerHTML = answer;
    btn.classList.add("answer-btn");

    btn.addEventListener("click", () => {
      Array.from(answersContainer.children).forEach(button => {
        button.disabled = true;

        if (button.innerHTML === current.correct) {
          button.classList.add("correct");
        } else if (button.innerHTML === answer && answer !== current.correct) {
          button.classList.add("wrong");
        }
      });

      if (answer === current.correct) {
        score++;
        scorePoints.textContent = score;
      }

      setTimeout(() => {
        changeQuestion(1);
      }, 1500);
    });

    answersContainer.appendChild(btn);
  });
}

function changeQuestion(step) {
  currentIndex += step;


  if (currentIndex < 0) {
    currentIndex = 0;
    return;
  }

  if (currentIndex >= questions.length) {
    showScore();
  } else {
    displayQuestion();
  }
}

function showScore() {
  quizContainer.classList.add("hidden");
  scoreScreen.classList.remove("hidden");
  scoreDisplay.textContent = score;
  clearInterval(timer);
}

function startTimer() {
  timeLeft = 30;
  timerDisplay.textContent = timeLeft;
  timer = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = timeLeft;
    if (timeLeft === 0) {
      clearInterval(timer);
      changeQuestion(1);
    }
  }, 1000);
}

function resetTimer() {
  clearInterval(timer);
  startTimer();
}

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

