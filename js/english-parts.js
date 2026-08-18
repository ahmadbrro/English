function speak(text) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'en-US'; u.rate = 0.85; u.pitch = 1;
  const voices = window.speechSynthesis.getVoices();
  const v = voices.find(v => v.lang.startsWith('en') && v.name.includes('Google'))
    || voices.find(v => v.lang.startsWith('en-US'))
    || voices.find(v => v.lang.startsWith('en'));
  if (v) u.voice = v;
  window.speechSynthesis.speak(u);
}
if ('speechSynthesis' in window) speechSynthesis.onvoiceschanged = () => speechSynthesis.getVoices();

document.querySelectorAll('.nav-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tense-section').forEach(s => s.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('sec-' + tab.dataset.section).classList.add('active');
  });
});

const quizData = [
  { q: 'un- means:', sub: 'سابقة', a: 'not / opposite', opts: ['not / opposite', 'again', 'before', 'under'] },
  { q: 're- means:', sub: 'سابقة', a: 'again', opts: ['not', 'again', 'under', 'more'] },
  { q: '-tion makes a:', sub: 'لاحقة', a: 'noun', opts: ['verb', 'noun', 'adjective', 'adverb'] },
  { q: '-less means:', sub: 'لاحقة', a: 'without', opts: ['with', 'without', 'full of', 'full'] },
  { q: 'The cat is ___ the table.', sub: 'حرف جر مكان', a: 'under', opts: ['under', 'since', 'because', 'and'] },
  { q: 'I wake up ___ 7 AM.', sub: 'حرف جر زمان', a: 'at', opts: ['in', 'on', 'at', 'for'] },
  { q: 'I was born ___ 1995.', sub: 'حرف جر زمان', a: 'in', opts: ['at', 'on', 'in', 'by'] },
  { q: 'She is popular ___ her friends.', sub: 'حرف جر مكان', a: 'among', opts: ['among', 'until', 'although', 'so'] },
  { q: 'I bought apples ___ oranges.', sub: 'حرف ربط', a: 'and', opts: ['and', 'but', 'or', 'so'] },
  { q: 'I tried, ___ I failed.', sub: 'حرف ربط', a: 'but', opts: ['and', 'but', 'or', 'so'] },
  { q: '___ it rained, we went out.', sub: 'حرف ربط', a: 'Although', opts: ['Because', 'Although', 'And', 'So'] },
  { q: '___ you are here, let us start.', sub: 'حرف ربط', a: 'Since', opts: ['Since', 'Until', 'About', 'Through'] },
  { q: 'I stayed home ___ I was sick.', sub: 'حرف ربط', a: 'because', opts: ['because', 'despite', 'although', 'while'] },
  { q: 'able → ___ (noun)', sub: 'لاحقة', a: 'ability', opts: ['ability', 'enable', 'unable', 'ably'] },
  { q: 'modern → modern___ (verb)', sub: 'لاحقة', a: 'ize', opts: ['ness', 'ize', 'ful', 'ly'] },
  { q: 'The book is ___ the table.', sub: 'حرف جر مكان', a: 'on', opts: ['on', 'at', 'in', 'by'] },
  { q: 'Wait ___ I come back.', sub: 'حرف جر زمان', a: 'until', opts: ['until', 'for', 'since', 'during'] },
  { q: 'I went ___ the park.', sub: 'حرف جر', a: 'through', opts: ['through', 'at', 'on', 'for'] },
  { q: 'I left ___ saying goodbye.', sub: 'حرف جر', a: 'without', opts: ['with', 'without', 'about', 'into'] },
  { q: 'danger → ___ (adjective)', sub: 'لاحقة', a: 'dangerous', opts: ['dangerous', 'dangerless', 'dangerize', 'dangerful'] },
];
let qIdx = 0, qScore = 0, shuffled = [];

function shuffle(a) {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; }
  return b;
}

function startQuiz() {
  qIdx = 0; qScore = 0;
  shuffled = shuffle(quizData).slice(0, 15);
  document.getElementById('quiz-result').style.display = 'none';
  document.getElementById('quiz-fill').parentElement.style.display = 'block';
  showQ();
}

function showQ() {
  if (qIdx >= shuffled.length) {
    document.getElementById('quiz-fill').parentElement.style.display = 'none';
    document.getElementById('quiz-q').textContent = '';
    document.getElementById('quiz-sub').textContent = '';
    document.getElementById('quiz-opts').innerHTML = '';
    document.getElementById('quiz-fb').textContent = '';
    document.getElementById('quiz-next').style.display = 'none';
    document.getElementById('quiz-progress-text').textContent = '';
    const pct = Math.round((qScore / shuffled.length) * 100);
    document.getElementById('res-emoji').textContent = pct >= 80 ? '🎉' : pct >= 50 ? '👍' : '💪';
    document.getElementById('res-score').textContent = qScore + ' / ' + shuffled.length + ' - ' + pct + '%';
    document.getElementById('res-msg').textContent = pct >= 80 ? 'ممتاز!' : pct >= 50 ? 'جيد!' : 'تحتاج مراجعة!';
    document.getElementById('quiz-result').style.display = 'block';
    return;
  }
  const q = shuffled[qIdx];
  const pct = Math.round((qIdx / shuffled.length) * 100);
  document.getElementById('quiz-fill').style.width = pct + '%';
  document.getElementById('quiz-progress-text').textContent = (qIdx + 1) + ' / ' + shuffled.length;
  document.getElementById('quiz-q').textContent = q.q;
  document.getElementById('quiz-sub').textContent = q.sub;
  document.getElementById('quiz-fb').textContent = '';
  document.getElementById('quiz-next').style.display = 'none';
  document.getElementById('quiz-opts').innerHTML = shuffle(q.opts).map(o =>
    '<button class="quiz-opt" onclick="checkQ(this,\'' + o.replace(/'/g,"\\'") + '\',\'' + q.a.replace(/'/g,"\\'") + '\')">' + o + '</button>'
  ).join('');
}

function checkQ(btn, sel, correct) {
  const all = document.querySelectorAll('#quiz-opts .quiz-opt');
  all.forEach(b => {
    b.disabled = true;
    if (b.textContent.trim() === correct.trim()) b.classList.add('correct');
    if (b === btn && sel.trim() !== correct.trim()) b.classList.add('wrong');
  });
  const fb = document.getElementById('quiz-fb');
  if (sel.trim() === correct.trim()) {
    qScore++;
    fb.textContent = '✅ أحسنت!';
    fb.className = 'quiz-feedback good';
  } else {
    fb.textContent = '❌ الإجابة الصحيحة: ' + correct;
    fb.className = 'quiz-feedback bad';
  }
  document.getElementById('quiz-next').style.display = 'inline-flex';
}

function nextQ() { qIdx++; showQ(); }
startQuiz();
