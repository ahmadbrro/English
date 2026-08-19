/* ============================================================
   الكلام المنقول - Reported Speech
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
  { q: "She said, \"I am happy.\" → She said that she _____ happy.", opts: ["is", "was", "has been", "will be"], correct: "was" },
  { q: "He said, \"I will come tomorrow.\" → He said he _____ come the next day.", opts: ["will", "would", "shall", "could"], correct: "would" },
  { q: "\"Where do you live?\" she asked. → She asked where I _____.", opts: ["lived", "live", "was living", "had lived"], correct: "lived" },
  { q: "\"Are you tired?\" he asked. → He asked me if I _____.", opts: ["was tired", "am tired", "have been tired", "will be tired"], correct: "was tired" },
  { q: "He said, \"I can swim.\" → He said that he _____ swim.", opts: ["can", "could", "may", "would"], correct: "could" },
  { q: "\"Don't be late!\" she told him. → She told him not _____ late.", opts: ["to be", "be", "being", "to being"], correct: "to be" },
  { q: "She said, \"I have finished my work.\" → She said she _____ finished her work.", opts: ["has", "had", "have", "was"], correct: "had" },
  { q: "\"What are you doing?\" he asked. → He asked what I _____.", opts: ["was doing", "am doing", "did", "had done"], correct: "was doing" },
  { q: "He said, \"I saw her yesterday.\" → He said he had seen her _____.", opts: ["yesterday", "the day before", "today", "now"], correct: "the day before" },
  { q: "\"Close the door,\" she said to me. → She told me to _____ the door.", opts: ["close", "closed", "closing", "closes"], correct: "close" },
  { q: "She said, \"I may come early.\" → She said she _____ come early.", opts: ["may", "might", "could", "would"], correct: "might" },
  { q: "\"Why are you late?\" she asked. → She asked why I _____.", opts: ["was late", "am late", "have been late", "will be late"], correct: "was late" },
  { q: "He said, \"I must leave now.\" → He said he had to leave _____.", opts: ["then", "now", "today", "here"], correct: "then" },
  { q: "She said, \"My book is here.\" → She said _____ book was _____.", opts: ["her / there", "my / here", "his / here", "her / here"], correct: "her / there" },
  { q: "\"When did you arrive?\" he asked. → He asked when I _____.", opts: ["had arrived", "did arrive", "arrived", "arrive"], correct: "had arrived" },
  { q: "He said, \"I don't like coffee.\" → He said he _____ like coffee.", opts: ["doesn't", "didn't", "don't", "wouldn't"], correct: "didn't" },
  { q: "\"Please help me,\" she said. → She asked me to help _____.", opts: ["her", "she", "him", "me"], correct: "her" },
  { q: "She said, \"I will be studying at 5 PM.\" → She said she _____ studying at 5 PM.", opts: ["would be", "will be", "was", "had been"], correct: "would be" },
  { q: "He said, \"We play football every day.\" → He said they _____ football every day.", opts: ["played", "play", "were playing", "had played"], correct: "played" },
  { q: "\"How old are you?\" he asked. → He asked how old I _____.", opts: ["was", "am", "have been", "will be"], correct: "was" },
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
    speak(q.q.replace(/_+\s*\S*/, q.correct));
  } else {
    btn.classList.add("wrong");
    document.querySelector(`[data-val="${q.correct}"]`).classList.add("correct");
    fb.textContent = `❌ الإجابة الصحيحة: ${q.correct}`;
    fb.className = "quiz-feedback bad";
    speak(q.q.replace(/_+\s*\S*/, q.correct));
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
