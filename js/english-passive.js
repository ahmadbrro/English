/* ============================================================
   المبني للمجهول - Passive Voice
   ============================================================ */

function speak(text) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const msg = new SpeechSynthesisUtterance(text);
  msg.lang = "en-US";
  msg.rate = 0.85;
  window.speechSynthesis.speak(msg);
}

/* ---------- Navigation ---------- */
document.querySelectorAll(".nav-tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".nav-tab").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".section").forEach(s => s.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById("sec-" + tab.dataset.section).classList.add("active");
  });
});

/* ---------- Quiz ---------- */
const quizQuestions = [
  /* Present Simple Passive */
  { q: "English _____ in many countries.", opts: ["is spoken", "is speaking", "speaks", "was spoken"], correct: "is spoken" },
  { q: "The office _____ at 9 AM every day.", opts: ["is opened", "is opening", "opens", "was opened"], correct: "is opened" },
  { q: "Coffee _____ in Brazil.", opts: ["is grown", "is growing", "grows", "was grown"], correct: "is grown" },

  /* Present Continuous Passive */
  { q: "The road _____ right now.", opts: ["is being repaired", "is repaired", "is repairing", "was being repaired"], correct: "is being repaired" },
  { q: "Dinner _____ at the moment.", opts: ["is being prepared", "is prepared", "is preparing", "was being prepared"], correct: "is being prepared" },

  /* Present Perfect Passive */
  { q: "The book _____ into many languages.", opts: ["has been translated", "has been translating", "has translated", "had been translated"], correct: "has been translated" },
  { q: "All the tickets _____ already.", opts: ["have been sold", "have been selling", "have sold", "had been sold"], correct: "have been sold" },

  /* Past Simple Passive */
  { q: "The pyramids _____ thousands of years ago.", opts: ["were built", "were building", "built", "are built"], correct: "were built" },
  { q: "The window _____ last night.", opts: ["was broken", "was breaking", "broke", "is broken"], correct: "was broken" },
  { q: "The medicine _____ in 1928.", opts: ["was discovered", "was discovering", "discovered", "is discovered"], correct: "was discovered" },

  /* Past Continuous Passive */
  { q: "The house _____ when I arrived.", opts: ["was being painted", "was painted", "was painting", "were being painted"], correct: "was being painted" },

  /* Future Simple Passive */
  { q: "A new hospital _____ next year.", opts: ["will be built", "will build", "is built", "was built"], correct: "will be built" },
  { q: "The results _____ tomorrow.", opts: ["will be announced", "will announce", "are announced", "were announced"], correct: "will be announced" },
  { q: "The package _____ tonight.", opts: ["will be delivered", "will deliver", "is delivered", "was delivered"], correct: "will be delivered" },

  /* Modal Passive */
  { q: "This work _____ today.", opts: ["must be finished", "must finish", "must be finishing", "must finished"], correct: "must be finished" },
  { q: "The problem _____ easily.", opts: ["can be solved", "can solve", "can be solving", "can solved"], correct: "can be solved" },
  { q: "Mistakes _____ in exams.", opts: ["should be corrected", "should correct", "should be correcting", "should corrected"], correct: "should be corrected" },

  /* Mixed */
  { q: "The letter _____ by the postman yesterday.", opts: ["was delivered", "was delivering", "delivered", "is delivered"], correct: "was delivered" },
  { q: "A new bridge _____ in our city at the moment.", opts: ["is being constructed", "is constructed", "was being constructed", "will be constructed"], correct: "is being constructed" },
];

let quizState = { index: 0, score: 0, answered: false };
let shuffledQuiz = [];

function startQuiz() {
  shuffledQuiz = shuffleArray([...quizQuestions]);
  quizState = { index: 0, score: 0, answered: false };
  document.getElementById("quiz-result").style.display = "none";
  document.getElementById("btn-restart").style.display = "none";
  renderQuiz();
}

function renderQuiz() {
  const q = shuffledQuiz[quizState.index];
  const total = shuffledQuiz.length;
  document.getElementById("quiz-fill").style.width = ((quizState.index) / total * 100) + "%";
  const qEl = document.getElementById("quiz-question");
  qEl.innerHTML = `<div style="margin-bottom:8px;font-size:14px;color:#64748b;">السؤال ${quizState.index + 1} من ${total}</div><div>${q.q}</div>`;
  const optsEl = document.getElementById("quiz-options");
  optsEl.innerHTML = q.opts.map(o => `<button class="quiz-opt" data-val="${o}">${o}</button>`).join("");
  document.getElementById("quiz-feedback").textContent = "";
  document.getElementById("quiz-feedback").className = "quiz-feedback";
  document.getElementById("btn-next").style.display = "none";
  quizState.answered = false;

  optsEl.querySelectorAll(".quiz-opt").forEach(btn => {
    btn.addEventListener("click", () => answerQuiz(btn));
  });
}

function answerQuiz(btn) {
  if (quizState.answered) return;
  quizState.answered = true;
  const q = shuffledQuiz[quizState.index];
  const fb = document.getElementById("quiz-feedback");
  document.querySelectorAll(".quiz-opt").forEach(b => b.disabled = true);

  if (btn.dataset.val === q.correct) {
    quizState.score++;
    btn.classList.add("correct");
    fb.textContent = "✅ إجابة صحيحة!";
    fb.className = "quiz-feedback good";
    speak(q.q.replace("_____", q.correct));
  } else {
    btn.classList.add("wrong");
    document.querySelector(`[data-val="${q.correct}"]`).classList.add("correct");
    fb.textContent = `❌ الإجابة الصحيحة: ${q.correct}`;
    fb.className = "quiz-feedback bad";
    speak(q.q.replace("_____", q.correct));
  }

  const last = quizState.index === shuffledQuiz.length - 1;
  const nextBtn = document.getElementById("btn-next");
  nextBtn.textContent = last ? "عرض النتيجة" : "السؤال التالي ←";
  nextBtn.style.display = "inline-flex";
  nextBtn.onclick = () => {
    if (last) {
      showResult();
    } else {
      quizState.index++;
      renderQuiz();
    }
  };
}

function showResult() {
  document.getElementById("quiz-options").innerHTML = "";
  document.getElementById("quiz-feedback").textContent = "";
  document.getElementById("btn-next").style.display = "none";
  document.getElementById("quiz-fill").style.width = "100%";

  const total = shuffledQuiz.length;
  const pct = Math.round((quizState.score / total) * 100);
  const msg = pct >= 90 ? "ممتاز! 🏆" : pct >= 70 ? "جيد جدًا! 👏" : pct >= 50 ? "جيد، واصل التدريب 💪" : "تحتاج إلى مزيد من المراجعة 📚";
  document.getElementById("quiz-question").innerHTML = "";
  document.getElementById("quiz-result").innerHTML = `
    <span class="big">${quizState.score} / ${total}</span>
    <div style="font-size:20px;font-weight:800;margin-top:8px;">${pct}%</div>
    <div class="msg">${msg}</div>`;
  document.getElementById("quiz-result").style.display = "block";
  document.getElementById("btn-restart").style.display = "inline-flex";
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

document.getElementById("btn-restart").addEventListener("click", startQuiz);
startQuiz();
