const startBtn = document.getElementById("start-btn");
const quizPage = document.getElementById("quiz-page");
const startPage = document.getElementById("start-page");
const resultPage = document.getElementById("result-page");
const questionElem = document.getElementById("question");
const optionsContainer = document.getElementById("options-container");
const scoreElem = document.getElementById("score");
const finalScoreElem = document.getElementById("final-score");
const answersReview = document.getElementById("answers-review");
const restartBtn = document.getElementById("restart-btn");

let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let incorrectAnswers = [];

startBtn.addEventListener("click", startQuiz);
restartBtn.addEventListener("click", () => location.reload());

function startQuiz() {
  fetch("https://opentdb.com/api.php?amount=10&category=9&difficulty=medium&type=multiple")
    .then((res) => res.json())
    .then((data) => {
      questions = data.results;
      startPage.style.display = "none";
      quizPage.style.display = "block";
      showQuestion();
    });
}

function showQuestion() {
  const currentQuestion = questions[currentQuestionIndex];
  questionElem.innerHTML = decodeHTML(currentQuestion.question);
  const answers = [...currentQuestion.incorrect_answers];
  const correct = currentQuestion.correct_answer;
  answers.splice(Math.floor(Math.random() * 4), 0, correct);

  optionsContainer.innerHTML = "";
  answers.forEach((answer) => {
    const btn = document.createElement("button");
    btn.textContent = decodeHTML(answer);
    btn.onclick = () => handleAnswer(answer, correct);
    optionsContainer.appendChild(btn);
  });
}

function handleAnswer(selected, correct) {
  if (selected === correct) {
    score++;
  } else {
    incorrectAnswers.push({
      question: questions[currentQuestionIndex].question,
      correctAnswer: correct,
    });
  }

  scoreElem.textContent = `Score: ${score}`;
  currentQuestionIndex++;

  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    showResults();
  }
}

function showResults() {
  quizPage.style.display = "none";
  resultPage.style.display = "block";
  finalScoreElem.textContent = `Your final score is ${score}/${questions.length}`;
  answersReview.innerHTML = "<h3>Correct Answers for Questions You Missed:</h3>";

  incorrectAnswers.forEach((item) => {
    const p = document.createElement("p");
    p.innerHTML = `<strong>${decodeHTML(item.question)}</strong><br>✅ ${decodeHTML(item.correctAnswer)}`;
    answersReview.appendChild(p);
  });
}

function decodeHTML(html) {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}
