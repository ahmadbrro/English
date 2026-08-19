/* ============================================================
   المصطلحات والتعارضيات الاصطلاحية - Idioms & Expressions
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
  { q: "What does 'break a leg' mean?", opts: ["Hurt your leg", "Good luck!", "Run fast", "Sit down"], correct: "Good luck!" },
  { q: "What does 'piece of cake' mean?", opts: ["A dessert", "Very easy", "Very sweet", "A small portion"], correct: "Very easy" },
  { q: "What does 'hit the nail on the head' mean?", opts: ["Hammer a nail", "Exactly right", "Hit someone", "Build something"], correct: "Exactly right" },
  { q: "What does 'let the cat out of the bag' mean?", opts: ["Free a pet", "Reveal a secret", "Catch a cat", "Open a bag"], correct: "Reveal a secret" },
  { q: "What does 'cost an arm and a leg' mean?", opts: ["Injury", "Very expensive", "Very cheap", "Physical pain"], correct: "Very expensive" },
  { q: "What does 'bite the bullet' mean?", opts: ["Eat something hard", "Endure something difficult", "Shoot a gun", "Feel pain"], correct: "Endure something difficult" },
  { q: "What does 'one in a million' mean?", opts: ["Rare and special", "Countable", "Ordinary", "Very old"], correct: "Rare and special" },
  { q: "What does 'at the eleventh hour' mean?", opts: ["At 11 AM", "Very early", "At the last moment", "On time"], correct: "At the last moment" },
  { q: "What does 'behind the eight ball' mean?", opts: ["Playing pool", "In a difficult situation", "Winning", "Losing weight"], correct: "In a difficult situation" },
  { q: "What does 'the whole nine yards' mean?", opts: ["Nine miles", "Everything", "A measurement", "A short distance"], correct: "Everything" },
  { q: "What does 'bittersweet' mean?", opts: ["Sweet and sour", "Mixed happy and sad feelings", "Very bitter", "Very sweet"], correct: "Mixed happy and sad feelings" },
  { q: "What does 'deafening silence' mean?", opts: ["Very quiet", "A silence that feels loud and uncomfortable", "Loud noise", "No sound at all"], correct: "A silence that feels loud and uncomfortable" },
  { q: "What does 'open secret' mean?", opts: ["A hidden truth", "A secret known by everyone", "A locked door", "A mystery"], correct: "A secret known by everyone" },
  { q: "What does 'keep an eye on' mean?", opts: ["Stare at", "Watch or monitor", "Close your eye", "Look away"], correct: "Watch or monitor" },
  { q: "What does 'cold feet' mean?", opts: ["Cold weather", "Nervousness or hesitation", "Frozen feet", "Walking barefoot"], correct: "Nervousness or hesitation" },
  { q: "What does 'pull someone's leg' mean?", opts: ["Trip someone", "Joke with someone", "Help someone", "Push someone"], correct: "Joke with someone" },
  { q: "What does 'butterflies in my stomach' mean?", opts: ["Hungry", "Nervous or anxious", "Sick", "Excited about food"], correct: "Nervous or anxious" },
  { q: "What does 'spill the beans' mean?", opts: ["Cook food", "Reveal a secret", "Drop something", "Clean up"], correct: "Reveal a secret" },
  { q: "What does 'on cloud nine' mean?", opts: ["Flying", "Very happy", "Confused", "Lost"], correct: "Very happy" },
  { q: "What does 'back to square one' mean?", opts: ["Return to the start", "Go to bed", "Finish the task", "Take a break"], correct: "Return to the start" },
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
    speak(q.correct);
  } else {
    btn.classList.add("wrong");
    document.querySelector(`[data-val="${q.correct}"]`).classList.add("correct");
    fb.textContent = `❌ الإجابة الصحيحة: ${q.correct}`;
    fb.className = "quiz-feedback bad";
    speak(q.correct);
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
