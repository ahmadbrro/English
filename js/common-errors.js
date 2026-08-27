"use strict";

const COMMON_ERROR_QUESTIONS = [
  { wrong: "She go to school every day.", correct: ["She goes to school every day."] },
  { wrong: "I have saw that movie before.", correct: ["I have seen that movie before."] },
  { wrong: "He don't like coffee.", correct: ["He doesn't like coffee."] },
  { wrong: "They was happy yesterday.", correct: ["They were happy yesterday."] },
  { wrong: "There is many books on the table.", correct: ["There are many books on the table."] },
  { wrong: "I am interesting in music.", correct: ["I am interested in music."] },
  { wrong: "We went at the park last Sunday.", correct: ["We went to the park last Sunday."] },
  { wrong: "She can sings very well.", correct: ["She can sing very well."] },
  { wrong: "He has lived here since five years.", correct: ["He has lived here for five years."] },
  { wrong: "I didn't went to work today.", correct: ["I didn't go to work today."] },
  { wrong: "The childrens are playing outside.", correct: ["The children are playing outside."] },
  { wrong: "My brother is taller then me.", correct: ["My brother is taller than me."] },
  { wrong: "Please give me an advice.", correct: ["Please give me some advice."] },
  { wrong: "She is married with a doctor.", correct: ["She is married to a doctor."] },
  { wrong: "I look forward to meet you.", correct: ["I look forward to meeting you."] },
  { wrong: "This informations are useful.", correct: ["This information is useful."] },
  { wrong: "He arrived to the airport early.", correct: ["He arrived at the airport early."] },
  { wrong: "I have a good news for you.", correct: ["I have good news for you."] },
  { wrong: "She explained me the problem.", correct: ["She explained the problem to me."] },
  { wrong: "Your welcome to join us.", correct: ["You're welcome to join us."] }
];

const errorsState = { questions: [], index: 0, score: 0, answered: false };

function normalizeErrorAnswer(value) {
  return value.trim().toLowerCase()
    .replace(/[.!?]+$/g, "")
    .replace(/\s+/g, " ");
}

function renderErrorQuestion() {
  const question = errorsState.questions[errorsState.index];
  document.getElementById("errors-progress").textContent = `السؤال ${errorsState.index + 1} من ${errorsState.questions.length} | النتيجة: ${errorsState.score}`;
  document.getElementById("errors-sentence").textContent = question.wrong;
  document.getElementById("errors-input").value = "";
  document.getElementById("errors-input").disabled = false;
  document.getElementById("btn-errors-check").hidden = false;
  document.getElementById("btn-errors-next").hidden = true;
  document.getElementById("errors-feedback").textContent = "";
  document.getElementById("errors-feedback").className = "quiz-feedback";
  errorsState.answered = false;
  document.getElementById("errors-input").focus();
}

function startCommonErrors() {
  const count = Math.min(Math.max(1, parseInt(document.getElementById("errors-count").value, 10) || 10), COMMON_ERROR_QUESTIONS.length);
  errorsState.questions = shuffle(COMMON_ERROR_QUESTIONS).slice(0, count);
  errorsState.index = 0;
  errorsState.score = 0;
  document.getElementById("errors-setup").hidden = true;
  document.getElementById("errors-result").hidden = true;
  document.getElementById("errors-area").hidden = false;
  renderErrorQuestion();
}

function checkCommonError() {
  if (errorsState.answered) return;
  const input = document.getElementById("errors-input");
  const question = errorsState.questions[errorsState.index];
  const answer = normalizeErrorAnswer(input.value);
  if (!answer) {
    toast("اكتب الجملة المصححة أولًا");
    return;
  }
  errorsState.answered = true;
  input.disabled = true;
  document.getElementById("btn-errors-check").hidden = true;
  const isCorrect = question.correct.some(correct => normalizeErrorAnswer(correct) === answer);
  const feedback = document.getElementById("errors-feedback");
  if (isCorrect) {
    errorsState.score++;
    feedback.textContent = "✅ إجابة صحيحة!";
    feedback.className = "quiz-feedback good";
  } else {
    feedback.innerHTML = `❌ التصحيح الصحيح: <b dir="ltr">${esc(question.correct[0])}</b>`;
    feedback.className = "quiz-feedback bad";
  }
  const next = document.getElementById("btn-errors-next");
  next.textContent = errorsState.index === errorsState.questions.length - 1 ? "عرض النتيجة" : "السؤال التالي";
  next.hidden = false;
}

function nextCommonError() {
  if (errorsState.index < errorsState.questions.length - 1) {
    errorsState.index++;
    renderErrorQuestion();
    return;
  }
  document.getElementById("errors-area").hidden = true;
  document.getElementById("errors-result").hidden = false;
  const total = errorsState.questions.length;
  const percent = Math.round((errorsState.score / total) * 100);
  document.getElementById("errors-score").innerHTML = `<span class="big">${errorsState.score} / ${total}</span> ${percent}%`;
  document.getElementById("errors-result-message").textContent = percent >= 70 ? "أحسنت، واصل التدريب!" : "راجع القاعدة وحاول مرة أخرى.";
}

function resetCommonErrors() {
  document.getElementById("errors-result").hidden = true;
  document.getElementById("errors-area").hidden = true;
  document.getElementById("errors-setup").hidden = false;
}

function initCommonErrors() {
  document.getElementById("btn-errors-start").addEventListener("click", startCommonErrors);
  document.getElementById("btn-errors-check").addEventListener("click", checkCommonError);
  document.getElementById("btn-errors-next").addEventListener("click", nextCommonError);
  document.getElementById("btn-errors-retry").addEventListener("click", resetCommonErrors);
  document.getElementById("errors-input").addEventListener("keydown", event => {
    if (event.key === "Enter") {
      if (errorsState.answered) nextCommonError();
      else checkCommonError();
    }
  });
}

document.addEventListener("DOMContentLoaded", initCommonErrors);
