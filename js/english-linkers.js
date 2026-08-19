/* ============================================================
   أدوات الربط - Linking Words
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
  { q: "I stayed home _____ it was raining.", opts: ["because", "however", "although", "therefore"], correct: "because" },
  { q: "He studied hard; _____, he passed the exam.", opts: ["therefore", "because", "but", "although"], correct: "therefore" },
  { q: "_____ it was cold, she went swimming.", opts: ["Although", "Because", "So", "Therefore"], correct: "Although" },
  { q: "The job pays well. _____, it's stressful.", opts: ["On the other hand", "Because", "So", "And"], correct: "On the other hand" },
  { q: "She is not only smart _____ also hardworking.", opts: ["but", "and", "however", "although"], correct: "but" },
  { q: "I like fruits _____ apples and oranges.", opts: ["such as", "because", "therefore", "however"], correct: "such as" },
  { q: "_____ , we need to gather data.", opts: ["Firstly", "Because", "However", "So"], correct: "Firstly" },
  { q: "He was tired. _____, he kept working.", opts: ["Nevertheless", "Because", "So", "And"], correct: "Nevertheless" },
  { q: "It rained heavily. _____, the game was canceled.", opts: ["As a result", "Because", "But", "Although"], correct: "As a result" },
  { q: "_____ the rain, we went out.", opts: ["Despite", "Although", "Because", "So"], correct: "Despite" },
  { q: "He likes tea _____ she prefers coffee.", opts: ["whereas", "because", "so", "and"], correct: "whereas" },
  { q: "I would like to thank everyone.", opts: ["Finally", "Because", "However", "So"], correct: "Finally" },
  { q: "She also speaks French.", opts: ["also", "but", "although", "therefore"], correct: "also" },
  { q: "The plan is cheap. _____, it is effective.", opts: ["Moreover", "Because", "So", "But"], correct: "Moreover" },
  { q: "_____ you are here, let's start.", opts: ["Since", "But", "However", "So"], correct: "Since" },
  { q: "I was tired, _____ I went to bed.", opts: ["so", "but", "although", "because"], correct: "so" },
  { q: "Even _____ it was expensive, we bought it.", opts: ["though", "so", "because", "therefore"], correct: "though" },
  { q: "She is young _____ very talented.", opts: ["yet", "but", "because", "so"], correct: "yet" },
  { q: "_____ the introduction, we discussed the body.", opts: ["After that", "Because", "However", "So"], correct: "After that" },
  { q: "In _____, exercise is essential for health.", opts: ["conclusion", "addition", "contrast", "general"], correct: "conclusion" },
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
  document.getElementById("quiz-question").textContent = `السؤال ${quizState.index + 1} / ${total}`;
  document.getElementById("quiz-question").insertAdjacentHTML("afterend", "");
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
