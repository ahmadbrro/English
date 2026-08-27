"use strict";

const WORD_RELATIONS = [
  { word: "happy", synonym: "glad", opposite: "sad" },
  { word: "sad", synonym: "unhappy", opposite: "happy" },
  { word: "hot", synonym: "warm", opposite: "cold" },
  { word: "cold", synonym: "cool", opposite: "hot" },
  { word: "big", synonym: "large", opposite: "small" },
  { word: "small", synonym: "little", opposite: "big" },
  { word: "fast", synonym: "quick", opposite: "slow" },
  { word: "slow", synonym: "unhurried", opposite: "fast" },
  { word: "easy", synonym: "simple", opposite: "difficult" },
  { word: "difficult", synonym: "hard", opposite: "easy" },
  { word: "beautiful", synonym: "pretty", opposite: "ugly" },
  { word: "ugly", synonym: "unattractive", opposite: "beautiful" },
  { word: "strong", synonym: "powerful", opposite: "weak" },
  { word: "weak", synonym: "feeble", opposite: "strong" },
  { word: "old", synonym: "ancient", opposite: "young" },
  { word: "young", synonym: "youthful", opposite: "old" },
  { word: "good", synonym: "fine", opposite: "bad" },
  { word: "bad", synonym: "awful", opposite: "good" },
  { word: "clean", synonym: "tidy", opposite: "dirty" },
  { word: "dirty", synonym: "messy", opposite: "clean" },
  { word: "rich", synonym: "wealthy", opposite: "poor" },
  { word: "poor", synonym: "needy", opposite: "rich" },
  { word: "bright", synonym: "shiny", opposite: "dark" },
  { word: "dark", synonym: "dim", opposite: "bright" },
  { word: "begin", synonym: "start", opposite: "finish" },
  { word: "finish", synonym: "end", opposite: "begin" },
  { word: "love", synonym: "like", opposite: "hate" },
  { word: "hate", synonym: "dislike", opposite: "love" },
  { word: "quiet", synonym: "silent", opposite: "noisy" },
  { word: "noisy", synonym: "loud", opposite: "quiet" }
];

function relationPool() {
  const scope = document.getElementById("quiz-scope").value;
  const pool = expandStudyWords(resolveScopeWords(scope, document.getElementById("quiz-section")));
  const available = new Set(pool.map(word => String(word.en).toLowerCase()));
  return WORD_RELATIONS.filter(relation => available.has(relation.word));
}

function startRelationsQuiz() {
  const candidates = relationPool();
  if (!candidates.length) {
    toast("لا توجد مرادفات أو متضادات متاحة لهذا النطاق");
    return;
  }
  const count = Math.min(Math.max(1, parseInt(document.getElementById("quiz-count").value, 10) || 10), candidates.length);
  state.quiz.questions = shuffle(candidates).slice(0, count).map(relation => {
    const askSynonym = Math.random() < 0.5;
    const correct = askSynonym ? relation.synonym : relation.opposite;
    const distractors = WORD_RELATIONS
      .filter(item => item.word !== relation.word)
      .map(item => askSynonym ? item.synonym : item.opposite);
    return {
      type: "relations",
      relation,
      isSynonym: askSynonym,
      correct,
      options: shuffle([correct, ...shuffle(distractors).slice(0, 3)])
    };
  });
  state.quiz.index = 0;
  state.quiz.score = 0;
  state.quiz.type = "relations";
  state.quiz.answered = false;
  document.getElementById("quiz-setup").hidden = true;
  document.getElementById("quiz-result").hidden = true;
  document.getElementById("quiz-area").hidden = false;
  document.getElementById("quiz-area").removeAttribute("dir");
  renderRelationsQuestion();
}

function renderRelationsQuestion() {
  const question = state.quiz.questions[state.quiz.index];
  document.getElementById("quiz-progress-text").textContent = `السؤال ${state.quiz.index + 1} من ${state.quiz.questions.length}`;
  document.getElementById("quiz-progress-fill").style.width = `${(state.quiz.index / state.quiz.questions.length) * 100}%`;
  const questionEl = document.getElementById("quiz-question");
  questionEl.setAttribute("dir", "ltr");
  questionEl.textContent = question.relation.word;
  document.querySelector(".quiz-question-sub").textContent = question.isSynonym ? "اختر المرادف الصحيح" : "اختر العكس الصحيح";
  const options = document.getElementById("quiz-options");
  options.innerHTML = question.options.map((option, index) => `<button class="quiz-option" data-i="${index}" dir="ltr">${esc(option)}</button>`).join("");
  document.getElementById("quiz-feedback").textContent = "";
  document.getElementById("quiz-feedback").className = "quiz-feedback";
  document.getElementById("btn-quiz-next").hidden = true;
  options.querySelectorAll(".quiz-option").forEach(button => button.addEventListener("click", () => answerRelations(button)));
  state.quiz.answered = false;
}

function answerRelations(button) {
  if (state.quiz.answered) return;
  state.quiz.answered = true;
  const question = state.quiz.questions[state.quiz.index];
  const chosen = question.options[Number(button.dataset.i)];
  const correct = chosen === question.correct;
  document.querySelectorAll(".quiz-option").forEach(option => {
    option.disabled = true;
    if (option.textContent === question.correct) option.classList.add("correct");
  });
  const feedback = document.getElementById("quiz-feedback");
  if (correct) {
    state.quiz.score++;
    feedback.textContent = "✅ إجابة صحيحة!";
    feedback.className = "quiz-feedback good";
  } else {
    button.classList.add("wrong");
    feedback.innerHTML = `❌ الإجابة الصحيحة: <b dir="ltr">${esc(question.correct)}</b>`;
    feedback.className = "quiz-feedback bad";
  }
  const next = document.getElementById("btn-quiz-next");
  next.textContent = state.quiz.index === state.quiz.questions.length - 1 ? "عرض النتيجة" : "السؤال التالي";
  next.hidden = false;
}

function initRelationsQuiz() {
  const typeSelect = document.getElementById("quiz-type");
  const startButton = document.getElementById("btn-quiz-start");
  const originalRenderQuizQuestion = renderQuizQuestion;
  renderQuizQuestion = () => {
    if (state.quiz.type === "relations") renderRelationsQuestion();
    else originalRenderQuizQuestion();
  };
  startButton.addEventListener("click", event => {
    if (typeSelect.value === "relations") {
      event.preventDefault();
      event.stopImmediatePropagation();
      startRelationsQuiz();
    }
  }, true);
  document.getElementById("quiz-type").addEventListener("change", event => {
    document.getElementById("quiz-direction-row").hidden = event.target.value !== "translation";
  });
}

document.addEventListener("DOMContentLoaded", initRelationsQuiz);
