function speak(text) {
  if (!('speechSynthesis' in window)) return;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'en-US';
  u.rate = 0.85;
  speechSynthesis.cancel();
  speechSynthesis.speak(u);
}

document.querySelectorAll('.nav-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    tab.classList.add('active');
    const sec = document.getElementById('section-' + tab.dataset.section);
    if (sec) sec.classList.add('active');
    if (tab.dataset.section === 'quiz') startQuiz();
  });
});

const quizData = [
  { q: '___ sun rises in the east.', a: ['The'], opts: ['A', 'An', 'The', 'Ø'] },
  { q: 'I need ___ book to read.', a: ['A'], opts: ['A', 'An', 'The', 'Ø'] },
  { q: 'She ate ___ apple for lunch.', a: ['An'], opts: ['A', 'An', 'The', 'Ø'] },
  { q: '___ water in this bottle is cold.', a: ['The'], opts: ['A', 'An', 'The', 'Ø'] },
  { q: 'He is ___ honest man.', a: ['An'], opts: ['A', 'An', 'The', 'Ø'] },
  { q: 'I live in ___ Egypt.', a: ['Ø'], opts: ['A', 'An', 'The', 'Ø'] },
  { q: 'She speaks ___ English fluently.', a: ['Ø'], opts: ['A', 'An', 'The', 'Ø'] },
  { q: 'We went to ___ school to learn.', a: ['Ø'], opts: ['A', 'An', 'The', 'Ø'] },
  { q: '___ Internet is very useful.', a: ['The'], opts: ['A', 'An', 'The', 'Ø'] },
  { q: 'I play ___ football every weekend.', a: ['Ø'], opts: ['A', 'An', 'The', 'Ø'] },
  { q: 'He is ___ university student.', a: ['A'], opts: ['A', 'An', 'The', 'Ø'] },
  { q: 'Can you pass me ___ salt?', a: ['The'], opts: ['A', 'An', 'The', 'Ø'] },
  { q: 'I had ___ breakfast at 7 AM.', a: ['Ø'], opts: ['A', 'An', 'The', 'Ø'] },
  { q: 'She went to ___ bed early.', a: ['Ø'], opts: ['A', 'An', 'The', 'Ø'] },
  { q: '___ moon looks beautiful tonight.', a: ['The'], opts: ['A', 'An', 'The', 'Ø'] },
  { q: 'He went to ___ prison for 5 years.', a: ['Ø'], opts: ['A', 'An', 'The', 'Ø'] },
  { q: 'I saw ___ dog. ___ dog was big.', a: ['A', 'The'], multi: true, opts: ['A/An', 'The', 'Ø', 'A/An + The'] },
  { q: 'She is ___ European scientist.', a: ['A'], opts: ['A', 'An', 'The', 'Ø'] },
  { q: '___ environment must be protected.', a: ['The'], opts: ['A', 'An', 'The', 'Ø'] },
  { q: 'I need ___ umbrella. It is raining.', a: ['An'], opts: ['A', 'An', 'The', 'Ø'] }
];

let currentQ = 0, score = 0, shuffled = [], answered = false;

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function startQuiz() {
  shuffled = shuffleArray(quizData);
  currentQ = 0;
  score = 0;
  answered = false;
  renderQuiz();
}

function renderQuiz() {
  if (currentQ >= shuffled.length) { showResult(); return; }
  answered = false;
  const q = shuffled[currentQ];
  const pct = (currentQ / shuffled.length) * 100;
  document.getElementById('quizProgressFill').style.width = pct + '%';
  const isMulti = q.multi;
  const optsHtml = isMulti
    ? '<button class="quiz-opt" onclick="answerQuiz(this,\'' + q.a.join('/') + '\',\'' + q.a.join('/') + '\')">' + q.opts.join('</button><button class="quiz-opt" onclick="answerQuiz(this,\'' + q.a.join('/') + '\',\'' + q.a.join('/') + '\')">') + '</button>'
    : q.opts.map(o => {
        const val = o === 'Ø' ? 'Ø' : o;
        return '<button class="quiz-opt" onclick="answerQuiz(this,\'' + val + '\',\'' + q.a[0] + '\')">' + o + '</button>';
      }).join('');
  document.getElementById('quizContent').innerHTML =
    '<div class="quiz-question">' + q.q.replace(/___/g, '________') + '</div>' +
    '<div class="quiz-options" id="quizOpts">' + optsHtml + '</div>' +
    '<div class="quiz-feedback" id="quizFeedback"></div>' +
    '<div class="quiz-nav" id="quizNav" style="display:none"><button class="btn btn-primary" onclick="nextQ()">السؤال التالي ➡️</button></div>';
}

function answerQuiz(btn, chosen, correct) {
  if (answered) return;
  answered = true;
  const isCorrect = chosen === correct;
  if (isCorrect) score++;
  document.querySelectorAll('#quizOpts .quiz-opt').forEach(b => {
    b.disabled = true;
    if (b.textContent.trim() === correct || b.textContent.trim().replace(/\//g, '/') === correct) b.classList.add('correct');
  });
  if (!isCorrect) btn.classList.add('wrong');
  const fb = document.getElementById('quizFeedback');
  fb.className = 'quiz-feedback ' + (isCorrect ? 'good' : 'bad');
  fb.textContent = isCorrect ? '✅ أحسنت! إجابة صحيحة' : '❌ إجابة خاطئة - الصواب: ' + correct;
  document.getElementById('quizNav').style.display = 'block';
}

function nextQ() {
  currentQ++;
  renderQuiz();
}

function showResult() {
  document.getElementById('quizProgressFill').style.width = '100%';
  const total = shuffled.length;
  const pct = Math.round((score / total) * 100);
  let msg = '';
  if (pct === 100) msg = 'ممتاز! أداء رائع! 🌟';
  else if (pct >= 75) msg = 'جيد جدًا! استمر في التعلم! 💪';
  else if (pct >= 50) msg = 'جيد، لكن تحتاج لمراجعة بعض القواعد 📖';
  else msg = 'راجع القواعد وحاول مرة أخرى 🔄';
  document.getElementById('quizContent').innerHTML =
    '<div class="quiz-result">' +
    '<span class="big">' + score + '/' + total + '</span>' +
    '<div class="msg">' + msg + '</div>' +
    '<div style="margin-top:20px"><button class="btn btn-primary" onclick="startQuiz()">🔄 إعادة الاختبار</button></div>' +
    '</div>';
}

startQuiz();
