// ===== Text-to-Speech =====
function speak(text) {
  if (!('speechSynthesis' in window)) {
    alert('متصفحك لا يدعم خاصية النطق!');
    return;
  }
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'en-US';
  u.rate = 0.85;
  u.pitch = 1;

  const voices = window.speechSynthesis.getVoices();
  const enVoice = voices.find(v => v.lang.startsWith('en') && v.name.includes('Google'))
    || voices.find(v => v.lang.startsWith('en-US'))
    || voices.find(v => v.lang.startsWith('en'));
  if (enVoice) u.voice = enVoice;

  window.speechSynthesis.speak(u);
}
function speakText(text) { speak(text); }

if ('speechSynthesis' in window) {
  speechSynthesis.onvoiceschanged = () => speechSynthesis.getVoices();
}

// ===== Navigation =====
document.querySelectorAll('.nav-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('sec-' + tab.dataset.section).classList.add('active');
  });
});

// ===== Alphabet =====
const alphabet = [
  {upper:'A', lower:'a', phonetic:'/eɪ/'},
  {upper:'B', lower:'b', phonetic:'/biː/'},
  {upper:'C', lower:'c', phonetic:'/siː/'},
  {upper:'D', lower:'d', phonetic:'/diː/'},
  {upper:'E', lower:'e', phonetic:'/iː/'},
  {upper:'F', lower:'f', phonetic:'/ɛf/'},
  {upper:'G', lower:'g', phonetic:'/dʒiː/'},
  {upper:'H', lower:'h', phonetic:'/eɪtʃ/'},
  {upper:'I', lower:'i', phonetic:'/aɪ/'},
  {upper:'J', lower:'j', phonetic:'/dʒeɪ/'},
  {upper:'K', lower:'k', phonetic:'/keɪ/'},
  {upper:'L', lower:'l', phonetic:'/ɛl/'},
  {upper:'M', lower:'m', phonetic:'/ɛm/'},
  {upper:'N', lower:'n', phonetic:'/ɛn/'},
  {upper:'O', lower:'o', phonetic:'/oʊ/'},
  {upper:'P', lower:'p', phonetic:'/piː/'},
  {upper:'Q', lower:'q', phonetic:'/kjuː/'},
  {upper:'R', lower:'r', phonetic:'/ɑːr/'},
  {upper:'S', lower:'s', phonetic:'/ɛs/'},
  {upper:'T', lower:'t', phonetic:'/tiː/'},
  {upper:'U', lower:'u', phonetic:'/juː/'},
  {upper:'V', lower:'v', phonetic:'/viː/'},
  {upper:'W', lower:'w', phonetic:'/ˈdʌbəljuː/'},
  {upper:'X', lower:'x', phonetic:'/ɛks/'},
  {upper:'Y', lower:'y', phonetic:'/waɪ/'},
  {upper:'Z', lower:'z', phonetic:'/ziː/'}
];

const alphaGrid = document.getElementById('alpha-grid');
alphabet.forEach(l => {
  const card = document.createElement('div');
  card.className = 'alpha-card';
  card.onclick = () => speak(l.upper);
  card.innerHTML = `
    <div class="sound-icon">🔊</div>
    <div class="alpha-upper">${l.upper}</div>
    <div class="alpha-lower">${l.lower}</div>
    <div class="alpha-sound">${l.phonetic}</div>
  `;
  alphaGrid.appendChild(card);
});

// ===== Quiz 1: Fill in the blank =====
const quizData1 = [
  { q: 'I ___ a student.', correct: 'am', options: ['am', 'is', 'are', 'was'] },
  { q: 'She ___ two sisters.', correct: 'has', options: ['have', 'has', 'had', 'having'] },
  { q: 'They ___ at home yesterday.', correct: 'were', options: ['was', 'were', 'are', 'is'] },
  { q: 'This is ___ book.', correct: 'my', options: ['my', 'I', 'me', 'mine'] },
  { q: 'He ___ a new car.', correct: 'has', options: ['have', 'has', 'had', 'is'] },
  { q: 'We ___ happy.', correct: 'are', options: ['is', 'am', 'are', 'was'] },
  { q: 'I ___ lunch at noon.', correct: 'have', options: ['has', 'had', 'have', 'having'] },
  { q: 'He ___ tired yesterday.', correct: 'was', options: ['is', 'was', 'were', 'has'] },
  { q: 'This is ___ house.', correct: 'our', options: ['we', 'us', 'our', 'ours'] },
  { q: 'I ___ to school every day.', correct: 'go', options: ['go', 'goes', 'going', 'went'] },
  { q: 'She ___ English very well.', correct: 'speaks', options: ['speak', 'speaks', 'speaking', 'spoke'] },
  { q: 'They ___ a big family.', correct: 'have', options: ['has', 'have', 'had', 'having'] },
  { q: 'The cat licked ___ paw.', correct: 'its', options: ['it', 'its', "it's", 'their'] },
  { q: 'We ___ the homework.', correct: 'did', options: ['do', 'does', 'did', 'done'] },
  { q: 'You ___ my best friend.', correct: 'are', options: ['is', 'am', 'are', 'was'] },
  { q: 'He ___ a book every week.', correct: 'reads', options: ['read', 'reads', 'reading', 'readed'] },
  { q: 'I ___ not understand.', correct: 'do', options: ['do', 'does', 'did', 'am'] },
  { q: 'She ___ cooking dinner.', correct: 'is', options: ['is', 'are', 'am', 'has'] },
  { q: 'They ___ gone to school.', correct: 'have', options: ['have', 'has', 'had', 'is'] },
  { q: 'It ___ cold outside.', correct: 'is', options: ['is', 'are', 'was', 'were'] },
  { q: 'She ___ not like coffee.', correct: 'doesn\'t', options: ['don\'t', 'doesn\'t', 'didn\'t', 'isn\'t'] },
  { q: '___ you speak English?', correct: 'Do', options: ['Do', 'Does', 'Did', 'Are'] },
  { q: 'He ___ his homework every day.', correct: 'does', options: ['do', 'does', 'did', 'doing'] },
  { q: '___ she go to school yesterday?', correct: 'Did', options: ['Do', 'Does', 'Did', 'Was'] },
  { q: 'They ___ not finish the work.', correct: 'didn\'t', options: ['don\'t', 'doesn\'t', 'didn\'t', 'weren\'t'] },
  { q: 'I ___ exercise every morning.', correct: 'do', options: ['do', 'does', 'did', 'doing'] },
  { q: '___ he play football?', correct: 'Does', options: ['Do', 'Does', 'Did', 'Is'] },
  { q: 'She ___ the dishes last night.', correct: 'did', options: ['do', 'does', 'did', 'done'] },
  { q: 'We ___ not understand the lesson.', correct: 'don\'t', options: ['don\'t', 'doesn\'t', 'didn\'t', 'aren\'t'] },
];
let q1Index = 0, q1Score = 0;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function startQuiz1() {
  q1Index = 0; q1Score = 0;
  document.getElementById('quiz-area-1').style.display = 'block';
  document.getElementById('quiz-result-1').style.display = 'none';
  showQuiz1();
}

function showQuiz1() {
  if (q1Index >= quizData1.length) {
    document.getElementById('quiz-area-1').style.display = 'none';
    document.getElementById('quiz-result-1').style.display = 'block';
    const pct = Math.round((q1Score / quizData1.length) * 100);
    document.getElementById('result-emoji-1').textContent = pct >= 80 ? '🎉' : pct >= 50 ? '👍' : '💪';
    document.getElementById('result-text-1').textContent = `${q1Score} / ${quizData1.length} - ${pct}%`;
    return;
  }
  const q = quizData1[q1Index];
  document.getElementById('quiz-question-1').textContent = q.q;
  document.getElementById('quiz-feedback-1').textContent = '';
  document.getElementById('btn-next-1').style.display = 'none';
  const optDiv = document.getElementById('quiz-options-1');
  optDiv.innerHTML = '';
  shuffle(q.options).forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'word-choice';
    btn.textContent = opt;
    btn.onclick = () => checkQuiz1(btn, opt, q.correct);
    optDiv.appendChild(btn);
  });
}

function checkQuiz1(btn, selected, correct) {
  const allBtns = document.querySelectorAll('#quiz-options-1 .word-choice');
  allBtns.forEach(b => {
    b.style.pointerEvents = 'none';
    if (b.textContent === correct) b.style.background = '#d1fae5';
    if (b === btn && selected !== correct) b.style.background = '#fee2e2';
  });
  const fb = document.getElementById('quiz-feedback-1');
  if (selected === correct) {
    q1Score++;
    fb.textContent = '✅ أحسنت!';
    fb.style.color = '#059669';
    speak(quizData1[q1Index].q.replace('___', correct));
  } else {
    fb.textContent = `❌ الإجابة الصحيحة: ${correct}`;
    fb.style.color = '#dc2626';
  }
  document.getElementById('btn-next-1').style.display = 'inline-flex';
}

function nextQuiz1() {
  q1Index++;
  showQuiz1();
}

// ===== Quiz 2: Translation =====
const quizData2 = [
  { en: 'I am happy.', correct: 'أنا سعيد.', options: ['أنا سعيد.', 'أنت سعيد.', 'هو سعيد.', 'هم سعداء.'] },
  { en: 'She has a cat.', correct: 'لديها قطة.', options: ['لديها قطة.', 'لديه قطة.', 'لدي قطة.', 'لديهم قطة.'] },
  { en: 'We are students.', correct: 'نحن طلاب.', options: ['نحن طلاب.', 'أنت طالب.', 'هم طلاب.', 'هو طالب.'] },
  { en: 'He was at school.', correct: 'كان في المدرسة.', options: ['كان في المدرسة.', 'هو في المدرسة.', 'هم في المدرسة.', 'كانت في المدرسة.'] },
  { en: 'This is my house.', correct: 'هذا منزلي.', options: ['هذا منزلي.', 'هذا ينتمي إليك.', 'هذا منزلك.', 'هذا منزله.'] },
  { en: 'They have three children.', correct: 'لديهم ثلاثة أطفال.', options: ['لديهم ثلاثة أطفال.', 'لدي ثلاثة أطفال.', 'لديها ثلاثة أطفال.', 'كان لديهم ثلاثة أطفال.'] },
  { en: 'You are my friend.', correct: 'أنت صديقي.', options: ['أنت صديقي.', 'أنت صديقك.', 'هو صديقي.', 'هي صديقتي.'] },
  { en: 'It was cold.', correct: 'كان بارداً.', options: ['كان بارداً.', 'هو بارد.', 'كانت باردة.', 'هم باردون.'] },
  { en: 'I love my family.', correct: 'أنا أحب عائلتي.', options: ['أنا أحب عائلتي.', 'أنا أحب عائلتك.', 'أنا أحب عائلته.', 'أنا أحب عائلتها.'] },
  { en: 'They are doctors.', correct: 'هم أطباء.', options: ['هم أطباء.', 'أنت طبيب.', 'نحن أطباء.', 'هو طبيب.'] },
];
let q2Index = 0, q2Score = 0;

function startQuiz2() {
  q2Index = 0; q2Score = 0;
  document.getElementById('quiz-area-2').style.display = 'block';
  document.getElementById('quiz-result-2').style.display = 'none';
  showQuiz2();
}

function showQuiz2() {
  if (q2Index >= quizData2.length) {
    document.getElementById('quiz-area-2').style.display = 'none';
    document.getElementById('quiz-result-2').style.display = 'block';
    const pct = Math.round((q2Score / quizData2.length) * 100);
    document.getElementById('result-emoji-2').textContent = pct >= 80 ? '🎉' : pct >= 50 ? '👍' : '💪';
    document.getElementById('result-text-2').textContent = `${q2Score} / ${quizData2.length} - ${pct}%`;
    return;
  }
  const q = quizData2[q2Index];
  document.getElementById('quiz-question-2').textContent = q.en;
  document.getElementById('quiz-feedback-2').textContent = '';
  document.getElementById('btn-next-2').style.display = 'none';
  speak(q.en);
  const optDiv = document.getElementById('quiz-options-2');
  optDiv.innerHTML = '';
  shuffle(q.options).forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'word-choice';
    btn.textContent = opt;
    btn.style.direction = 'rtl';
    btn.onclick = () => checkQuiz2(btn, opt, q.correct);
    optDiv.appendChild(btn);
  });
}

function checkQuiz2(btn, selected, correct) {
  const allBtns = document.querySelectorAll('#quiz-options-2 .word-choice');
  allBtns.forEach(b => {
    b.style.pointerEvents = 'none';
    if (b.textContent === correct) b.style.background = '#d1fae5';
    if (b === btn && selected !== correct) b.style.background = '#fee2e2';
  });
  const fb = document.getElementById('quiz-feedback-2');
  if (selected === correct) {
    q2Score++;
    fb.textContent = '✅ أحسنت!';
    fb.style.color = '#059669';
  } else {
    fb.textContent = `❌ الإجابة الصحيحة: ${correct}`;
    fb.style.color = '#dc2626';
  }
  document.getElementById('btn-next-2').style.display = 'inline-flex';
}

function nextQuiz2() {
  q2Index++;
  showQuiz2();
}

// Init quizzes
startQuiz1();
startQuiz2();
