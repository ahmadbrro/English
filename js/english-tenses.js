// ===== Speech =====
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

// ===== Navigation =====
document.querySelectorAll('.nav-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tense-section').forEach(s => s.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('sec-' + tab.dataset.section).classList.add('active');
  });
});

// ===== Quiz =====
const quizData = [
  { q: 'I ___ to school yesterday.', sub: 'ماضي بسيط', a: 'went', opts: ['went', 'go', 'going', 'have gone'] },
  { q: 'She ___ dinner right now.', sub: 'حاضر مستمر', a: 'is cooking', opts: ['cooks', 'is cooking', 'cooked', 'has cooked'] },
  { q: 'They ___ football since morning.', sub: 'حاضر تام مستمر', a: 'have been playing', opts: ['play', 'played', 'have been playing', 'are playing'] },
  { q: 'He ___ his homework last night.', sub: 'ماضي بسيط', a: 'finished', opts: ['finishes', 'finished', 'has finished', 'is finishing'] },
  { q: 'I ___ English every day.', sub: 'حاضر بسيط', a: 'speak', opts: ['speak', 'am speaking', 'spoke', 'have spoken'] },
  { q: 'We ___ at the moment.', sub: 'حاضر مستمر', a: 'are studying', opts: ['study', 'are studying', 'studied', 'have studied'] },
  { q: 'She ___ already ___ the book.', sub: 'حاضر تام', a: 'has ... read', opts: ['has ... read', 'did ... read', 'is ... reading', 'was ... reading'] },
  { q: 'They ___ when I arrived.', sub: 'ماضي مستمر', a: 'were sleeping', opts: ['slept', 'were sleeping', 'have slept', 'are sleeping'] },
  { q: 'I ___ you tomorrow.', sub: 'مستقبل بسيط', a: 'will call', opts: ['call', 'am calling', 'will call', 'called'] },
  { q: 'By next year, she ___ here for 5 years.', sub: 'مستقبل تام', a: 'will have worked', opts: ['will work', 'will have worked', 'works', 'is working'] },
  { q: 'He ___ never ___ to Paris.', sub: 'حاضر تام', a: 'has ... been', opts: ['has ... been', 'did ... go', 'is ... going', 'was ... going'] },
  { q: 'I ___ TV when the phone rang.', sub: 'ماضي مستمر', a: 'was watching', opts: ['watched', 'was watching', 'have watched', 'am watching'] },
  { q: 'She ___ in London since 2019.', sub: 'حاضر تام', a: 'has lived', opts: ['lives', 'has lived', 'is living', 'lived'] },
  { q: 'We ___ to the beach next weekend.', sub: 'مستقبل بسيط', a: 'will go', opts: ['go', 'are going', 'will go', 'went'] },
  { q: 'By 9 PM, I ___ dinner.', sub: 'مستقبل تام', a: 'will have eaten', opts: ['will eat', 'will have eaten', 'eat', 'am eating'] },
  { q: 'He ___ football when it started to rain.', sub: 'ماضي مستمر', a: 'was playing', opts: ['played', 'was playing', 'has played', 'plays'] },
  { q: 'I ___ this book twice.', sub: 'حاضر تام', a: 'have read', opts: ['read', 'have read', 'am reading', 'had read'] },
  { q: 'She ___ at 7 AM every day.', sub: 'حاضر بسيط', a: 'wakes up', opts: ['wakes up', 'is waking up', 'woke up', 'has woken up'] },
  { q: 'They ___ here for 3 hours.', sub: 'حاضر تام مستمر', a: 'have been waiting', opts: ['wait', 'have been waiting', 'are waiting', 'were waiting'] },
  { q: 'I ___ to Paris before.', sub: 'حاضر تام', a: 'have been', opts: ['went', 'have been', 'am going', 'was going'] },
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
  document.getElementById('quiz-fill').parentElement.parentElement.style.display = 'block';
  showQ();
}

function showQ() {
  if (qIdx >= shuffled.length) {
    document.getElementById('quiz-fill').parentElement.parentElement.style.display = 'none';
    document.getElementById('quiz-q').textContent = '';
    document.getElementById('quiz-sub').textContent = '';
    document.getElementById('quiz-opts').innerHTML = '';
    document.getElementById('quiz-fb').textContent = '';
    document.getElementById('quiz-next').style.display = 'none';
    document.getElementById('quiz-progress-text').textContent = '';
    const pct = Math.round((qScore / shuffled.length) * 100);
    document.getElementById('res-emoji').textContent = pct >= 80 ? '🎉' : pct >= 50 ? '👍' : '💪';
    document.getElementById('res-score').textContent = `${qScore} / ${shuffled.length} - ${pct}%`;
    document.getElementById('res-msg').textContent = pct >= 80 ? 'ممتاز! أداء رائع!' : pct >= 50 ? 'جيد! استمر في التدريب!' : 'تحتاج لمزيد من المراجعة!';
    document.getElementById('quiz-result').style.display = 'block';
    return;
  }
  const q = shuffled[qIdx];
  const pct = Math.round(((qIdx) / shuffled.length) * 100);
  document.getElementById('quiz-fill').style.width = pct + '%';
  document.getElementById('quiz-progress-text').textContent = `${qIdx + 1} / ${shuffled.length}`;
  document.getElementById('quiz-q').textContent = q.q;
  document.getElementById('quiz-sub').textContent = q.sub;
  document.getElementById('quiz-fb').textContent = '';
  document.getElementById('quiz-next').style.display = 'none';
  const opts = shuffle(q.opts);
  document.getElementById('quiz-opts').innerHTML = opts.map(o =>
    `<button class="quiz-opt" onclick="checkQ(this,'${o.replace(/'/g,"\\'")}','${q.a.replace(/'/g,"\\'")}')">${o}</button>`
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
    fb.textContent = `❌ الإجابة الصحيحة: ${correct}`;
    fb.className = 'quiz-feedback bad';
  }
  document.getElementById('quiz-next').style.display = 'inline-flex';
}

function nextQ() { qIdx++; showQ(); }

startQuiz();
