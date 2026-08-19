/* ===== Speech ===== */
function speak(text) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'en-US';
  u.rate = 0.85;
  window.speechSynthesis.speak(u);
}

/* ===== Navigation ===== */
document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.nav-tab');
  const sections = document.querySelectorAll('.section');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      sections.forEach(s => s.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(tab.dataset.tab).classList.add('active');
    });
  });

  startQuiz();
});

/* ===== Quiz ===== */
const questions = [
  { q: '_____ book is on the table. (I)', opts: ['My','Me','Mine','Myself'], ans: 0, tip: 'قبل الاسم نستخدم My (ملكية)' },
  { q: 'This pen is _____. (she)', opts: ['she','her','hers','herself'], ans: 2, tip: 'بدون اسم بعدها نستخدم Hers (ملكية مستقلة)' },
  { q: 'He taught _____ French.', opts: ['him','his','himself','he'], ans: 2, tip: 'فاعل ومفعول متساويان → نفسه Himself' },
  { q: 'The president _____ attended the meeting.', opts: ['himself','his','him','he'], ans: 0, tip: 'للتأكيد نستخدم himself بعد الفاعل' },
  { q: 'Is this _____? (you)', opts: ['your','yours','you','yourself'], ans: 1, tip: 'بدون اسم بعدها → Yours' },
  { q: 'We enjoyed _____ at the party.', opts: ['we','our','ours','ourselves'], ans: 3, tip: 'جمع + انعكاسي = Ourselves (-selves)' },
  { q: '_____ car is red. (they)', opts: ['Their','Theirs','Them','Themselves'], ans: 0, tip: 'قبل الاسم → Their (ملكية)' },
  { q: 'That house is _____. (they)', opts: ['their','theirs','them','themselves'], ans: 1, tip: 'بدون اسم → theirs (ملكية مستقلة)' },
  { q: 'She hurt _____.', opts: ['she','her','herself','hers'], ans: 2, tip: 'نفس الشخص = herself' },
  { q: 'I did it _____. (أنا بنفسي)', opts: ['me','my','myself','mine'], ans: 2, tip: 'للتأكيد أو الانعكاس → myself' },
  { q: 'The cat cleaned _____.', opts: ['it','its','itself','its self'], ans: 2, tip: 'it + itself (انعكاسي)' },
  { q: '_____ mother is a teacher. (he)', opts: ['His','Him','Himself','He'], ans: 0, tip: 'قبل الاسم → His' },
  { q: 'This phone is not _____. (I)', opts: ['my','me','mine','myself'], ans: 2, tip: 'بدون اسم → mine' },
  { q: 'You should be proud of _____.', opts: ['you','your','yours','yourself'], ans: 3, tip: 'أنت + نفسك = yourself' },
  { q: 'The children made the cake _____.', opts: ['them','their','theirs','themselves'], ans: 3, tip: 'جمع → themselves' },
  { q: 'I gave the book to _____.', opts: ['myself','me','my','mine'], ans: 1, tip: 'مفعول به عادي → me وليس myself!' },
  { q: '_____ dog is friendly. (it)', opts: ['It','Its','It\'s','Itself'], ans: 1, tip: 'ملكية قبل الاسم → Its (بدون علامة اقتباس)' },
  { q: 'This is _____ car. (you)', opts: ['you','your','yours','yourself'], ans: 1, tip: 'قبل الاسم → your' },
  { q: 'We built this website _____.', opts: ['we','our','ours','ourselves'], ans: 3, tip: 'فاعل + جمع = ourselves' },
  { q: 'The book on the desk is _____. (she)', opts: ['she','her','hers','herself'], ans: 2, tip: 'بدون اسم بعد → hers' }
];

let shuffled = [], current = 0, score = 0;

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function startQuiz() {
  shuffled = [...questions];
  shuffleArray(shuffled);
  current = 0;
  score = 0;
  renderQuiz();
}

function renderQuiz() {
  const el = document.getElementById('quizContent');
  if (current >= shuffled.length) { showResult(); return; }
  const q = shuffled[current];
  const pct = (current / shuffled.length) * 100;
  document.getElementById('quizProgress').style.width = pct + '%';
  el.innerHTML = `
    <div class="quiz-question">${q.q}</div>
    <div class="quiz-options" id="quizOpts">
      ${q.opts.map((o, i) => `<button class="quiz-opt" onclick="answerQuiz(${i})">${o}</button>`).join('')}
    </div>
    <div class="quiz-feedback" id="quizFeedback"></div>
    <div style="text-align:center;margin-top:8px;font-size:13px;color:#64748b;">${current + 1} / ${shuffled.length}</div>
  `;
}

function answerQuiz(idx) {
  const q = shuffled[current];
  const btns = document.querySelectorAll('.quiz-opt');
  btns.forEach(b => b.disabled = true);
  const fb = document.getElementById('quizFeedback');
  if (idx === q.ans) {
    btns[idx].classList.add('correct');
    fb.className = 'quiz-feedback good';
    fb.textContent = '✅ أحسنت! ' + q.tip;
    score++;
  } else {
    btns[idx].classList.add('wrong');
    btns[q.ans].classList.add('correct');
    fb.className = 'quiz-feedback bad';
    fb.textContent = '❌ ' + q.tip;
  }
  setTimeout(() => { current++; renderQuiz(); }, 1800);
}

function showResult() {
  const pct = Math.round((score / shuffled.length) * 100);
  let msg = '';
  if (pct === 100) msg = 'ممتاز! أداء رائع! 🌟';
  else if (pct >= 75) msg = 'جيد جداً! استمر في التدريب 💪';
  else if (pct >= 50) msg = 'جيد، يمكنك التحسن أكثر 📚';
  else msg = 'حاول مرة أخرى وراجع القواعد 📖';

  document.getElementById('quizProgress').style.width = '100%';
  document.getElementById('quizContent').innerHTML = `
    <div class="quiz-result">
      <span class="big">${score} / ${shuffled.length}</span>
      <div class="msg">${msg}</div>
      <div style="margin-top:18px">
        <button class="btn btn-primary" onclick="startQuiz()">🔄 أعد الاختبار</button>
        <button class="btn btn-ghost" onclick="location.reload()">🏠 العودة</button>
      </div>
    </div>
  `;
}
