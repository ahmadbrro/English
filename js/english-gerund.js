function speak(text) {
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'en-US';
  u.rate = 0.85;
  speechSynthesis.speak(u);
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const quizData = [
  { q: "She enjoys ______ in the morning.", opts: ["swim", "swimming"], ans: 1, tip: "enjoy + gerund (V+ing)" },
  { q: "I decided ______ a new language.", opts: ["learning", "to learn"], ans: 1, tip: "decide + infinitive (to+V)" },
  { q: "Would you mind ______ the window?", opts: ["to open", "opening"], ans: 1, tip: "mind + gerund (V+ing)" },
  { q: "He promised ______ on time.", opts: ["to be", "being"], ans: 0, tip: "promise + infinitive (to+V)" },
  { q: "I can't afford ______ so much money.", opts: ["spending", "to spend"], ans: 1, tip: "afford + infinitive (to+V)" },
  { q: "They avoid ______ junk food.", opts: ["to eat", "eating"], ans: 1, tip: "avoid + gerund (V+ing)" },
  { q: "She hopes ______ a doctor someday.", opts: ["becoming", "to become"], ans: 1, tip: "hope + infinitive (to+V)" },
  { q: "I look forward to ______ from you.", opts: ["hear", "hearing"], ans: 1, tip: "'to' here is a preposition, so + gerund" },
  { q: "He suggested ______ the meeting.", opts: ["to postpone", "postponing"], ans: 1, tip: "suggest + gerund (V+ing)" },
  { q: "We plan ______ early tomorrow.", opts: ["leaving", "to leave"], ans: 1, tip: "plan + infinitive (to+V)" },
  { q: "I can't help ______ when I see that.", opts: ["to laugh", "laughing"], ans: 1, tip: "can't help + gerund (V+ing)" },
  { q: "She refused ______ any help.", opts: ["offering", "to offer"], ans: 1, tip: "refuse + infinitive (to+V)" },
  { q: "He kept ______ the same mistake.", opts: ["to make", "making"], ans: 1, tip: "keep + gerund (V+ing)" },
  { q: "I want ______ to the cinema tonight.", opts: ["going", "to go"], ans: 1, tip: "want + infinitive (to+V)" },
  { q: "Do you feel like ______ out for dinner?", opts: ["to go", "going"], ans: 1, tip: "feel like + gerund (V+ing)" },
  { q: "She stopped ______ a cigarette on the way home.", opts: ["buying", "to buy"], ans: 1, tip: "stop to do = stop in order to do something else" },
  { q: "Remember ______ the door before you leave.", opts: ["locking", "to lock"], ans: 1, tip: "remember to do = don't forget to do it" },
  { q: "I'll never forget ______ Paris last summer.", opts: ["to visit", "visiting"], ans: 1, tip: "forget doing = recall a past memory" },
  { q: "He tried ______ the window but it was stuck.", opts: ["opening", "to open"], ans: 1, tip: "try to do = attempt to do something" },
  { q: "After dinner, she went on ______ her homework.", opts: ["to do", "doing"], ans: 1, tip: "go on doing = continue the same thing" }
];

let currentQ = 0, score = 0, shuffled = [], answered = false;

function startQuiz() {
  currentQ = 0;
  score = 0;
  answered = false;
  shuffled = shuffleArray([...quizData]);
  document.getElementById('quizArea').innerHTML = '';
  renderQuiz();
}

function renderQuiz() {
  if (currentQ >= shuffled.length) { showResult(); return; }
  const d = shuffled[currentQ];
  const pct = ((currentQ) / shuffled.length * 100).toFixed(0);
  answered = false;
  document.getElementById('quizArea').innerHTML = `
    <div class="quiz-progress-bar"><div class="quiz-progress-fill" style="width:${pct}%"></div></div>
    <div class="quiz-question">${d.q}</div>
    <div class="quiz-options">
      ${d.opts.map((o, i) => `<button class="quiz-opt" onclick="answerQuiz(${i})">${o}</button>`).join('')}
    </div>
    <div class="quiz-feedback" id="qFeedback"></div>
    <div class="quiz-nav" id="qNav" style="display:none"><button class="btn btn-primary" onclick="nextQ()">التالي ←</button></div>
  `;
}

function answerQuiz(idx) {
  if (answered) return;
  answered = true;
  const d = shuffled[currentQ];
  const btns = document.querySelectorAll('.quiz-opt');
  btns.forEach((b, i) => {
    b.disabled = true;
    if (i === d.ans) b.classList.add('correct');
    if (i === idx && idx !== d.ans) b.classList.add('wrong');
  });
  const fb = document.getElementById('qFeedback');
  if (idx === d.ans) {
    score++;
    fb.className = 'quiz-feedback good';
    fb.textContent = '✓ أحسنت! ' + d.tip;
  } else {
    fb.className = 'quiz-feedback bad';
    fb.textContent = '✗ خطاً! ' + d.tip;
  }
  document.getElementById('qNav').style.display = '';
}

function nextQ() {
  currentQ++;
  renderQuiz();
}

function showResult() {
  const pct = Math.round(score / shuffled.length * 100);
  let msg = '';
  if (pct === 100) msg = 'ممتاز! أنت خبير في المصدر والفعل المجرد!';
  else if (pct >= 80) msg = 'رائع! أداء ممتاز.';
  else if (pct >= 60) msg = 'جيد، لكن تحتاج لمراجعة أكثر.';
  else msg = 'حاول مرة أخرى وراجع القواعد.';
  document.getElementById('quizArea').innerHTML = `
    <div class="quiz-result">
      <span class="big">${score}/${shuffled.length}</span>
      <div class="msg">${msg}</div>
      <br>
      <button class="btn btn-primary" onclick="startQuiz()">🔄 أعد الاختبار</button>
    </div>
  `;
}

document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.nav-tab');
  const sections = document.querySelectorAll('.section');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      sections.forEach(s => s.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(tab.dataset.section).classList.add('active');
    });
  });
});
