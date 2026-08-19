/* ============================================================
   الجمل الشرطية - Conditional Sentences
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
  { q: "If it rains tomorrow, I _____ at home.", opts: ["will stay", "would stay", "stayed", "stay"], correct: "will stay" },
  { q: "If I were rich, I _____ a big house.", opts: ["will buy", "would buy", "bought", "buy"], correct: "would buy" },
  { q: "If you heat water to 100°C, it _____.", opts: ["boils", "will boil", "boiled", "would boil"], correct: "boils" },
  { q: "If I had studied, I _____ the exam.", opts: ["would have passed", "will pass", "passed", "would pass"], correct: "would have passed" },
  { q: "If she _____ earlier, she would have caught the train.", opts: ["had left", "left", "leaves", "would leave"], correct: "had left" },
  { q: "If I spoke French, I _____ that job in Paris.", opts: ["would have taken", "will take", "took", "take"], correct: "would have taken" },
  { q: "If you _____ hard, you will pass.", opts: ["study", "studied", "would study", "will study"], correct: "study" },
  { q: "If I had time, I _____ you.", opts: ["would visit", "will visit", "visited", "have visited"], correct: "would visit" },
  { q: "If it hadn't rained, we _____ camping.", opts: ["would have gone", "will go", "went", "go"], correct: "would have gone" },
  { q: "If he _____ here, he would help us.", opts: ["were", "is", "will be", "has been"], correct: "were" },
  { q: "If you don't hurry, you _____ the bus.", opts: ["will miss", "would miss", "missed", "miss"], correct: "will miss" },
  { q: "If she had more time, she _____ French.", opts: ["would learn", "will learn", "learned", "has learned"], correct: "would learn" },
  { q: "If I were you, I _____ more.", opts: ["would study", "will study", "studied", "study"], correct: "would study" },
  { q: "If we _____ tickets, we would have seen the match.", opts: ["had booked", "booked", "book", "will book"], correct: "had booked" },
  { q: "If the weather is nice, we _____ to the beach.", opts: ["will go", "would go", "went", "go"], correct: "will go" },
  { q: "If I had studied medicine, I _____ a doctor now.", opts: ["would be", "will be", "am", "was"], correct: "would be" },
  { q: "If you _____ me, I would have helped you.", opts: ["had told", "told", "tell", "will tell"], correct: "had told" },
  { q: "If she _____ here, she would tell us.", opts: ["were", "is", "will be", "has been"], correct: "were" },
  { q: "If I have time, I _____ you.", opts: ["will visit", "would visit", "visited", "visit"], correct: "will visit" },
  { q: "If he had been there, he _____ the answer.", opts: ["would have known", "will know", "knew", "knows"], correct: "would have known" },
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
