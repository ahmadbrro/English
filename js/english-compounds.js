let currentSection = 'open';
let currentQuestion = 0;
let score = 0;
let answered = false;

const questions = [
  {
    q: "What type of compound is 'ice cream'?",
    options: ["Open", "Closed", "Hyphenated", "None"],
    answer: 0,
    explanation: "ice cream مركبة مفتوحة - تُكتب كلمتين منفصلتين"
  },
  {
    q: "What does 'sunflower' combine?",
    options: ["sun + flower", "sun + power", "sun + garden", "sun + field"],
    answer: 0,
    explanation: "sunflower = sun (شمس) + flower (زهرة) = عباد الشمس"
  },
  {
    q: "Which is a hyphenated compound?",
    options: ["bedroom", "mother-in-law", "classroom", "popcorn"],
    answer: 1,
    explanation: "mother-in-law تحتوي على علامة Hut- بين الكلمات"
  },
  {
    q: "What does 'post office' mean?",
    options: ["مكتب بريد", "مكتب عمل", "مكتب محامي", "مكتب صحفي"],
    answer: 0,
    explanation: "post office = post (بريد) + office (مكتب) = مكتب بريد"
  },
  {
    q: "Which type is 'bedroom'?",
    options: ["Open", "Closed", "Hyphenated", "None"],
    answer: 1,
    explanation: "bedroom مركبة مغلقة - اندمجت bed + room في كلمة واحدة"
  },
  {
    q: "What does 'rainbow' combine?",
    options: ["rain + bow", "rain + cloud", "rain + day", "rain + fall"],
    answer: 0,
    explanation: "rainbow = rain (مطر) + bow (قوس) = قوس قزح"
  },
  {
    q: "Which is an open compound?",
    options: ["football", "ice cream", "toothbrush", "keyboard"],
    answer: 1,
    explanation: "ice cream تُكتب كلمتين منفصلتين - مركبة مفتوحة"
  },
  {
    q: "What does 'grandmother' mean?",
    options: ["أم", "جدة", "أخت", "عمّة"],
    answer: 1,
    explanation: "grandmother = grand (كبير) + mother (أم) = جدة"
  },
  {
    q: "What type is 'six-year-old'?",
    options: ["Open", "Closed", "Hyphenated", "None"],
    answer: 2,
    explanation: "six-year-old مركبة نصف مغلقة - تحتوي على علامات Hut-"
  },
  {
    q: "Which compound means 'فرشاة أسنان'?",
    options: ["toothbrush", "toothpick", "toothpaste", "toothache"],
    answer: 0,
    explanation: "toothbrush = tooth (سن) + brush (فرشاة) = فرشاة أسنان"
  },
  {
    q: "What type is 'waterfall'?",
    options: ["Open", "Closed", "Hyphenated", "None"],
    answer: 1,
    explanation: "waterfall مركبة مغلقة - water + fall اندمجتا في كلمة واحدة"
  },
  {
    q: "Which means 'لوحة مفاتيح'?",
    options: ["keyboard", "keyring", "keychain", "keystone"],
    answer: 0,
    explanation: "keyboard = key (مفتاح) + board (لوحة) = لوحة مفاتيح"
  },
  {
    q: "What does 'well-known' mean?",
    options: ["معروف جيداً", "المعروف", "≿ known", "مجهول"],
    answer: 0,
    explanation: "well-known = well (جيداً) + known (معروف) = مشهور/معروف"
  },
  {
    q: "Which is a closed compound for food?",
    options: ["fast food", "pancake", "ice cream", "swimming pool"],
    answer: 1,
    explanation: "pancake = pan + cake اندمجت في كلمة واحدة - مركبة مغلقة"
  },
  {
    q: "What does 'homework' combine?",
    options: ["home + work", "house + work", "house + study", "home + study"],
    answer: 0,
    explanation: "homework = home (بيت) + work (عمل) = واجب منزلي"
  },
  {
    q: "Which is a family hyphenated compound?",
    options: ["grandmother", "brother-in-law", "classroom", "sunflower"],
    answer: 1,
    explanation: "brother-in-law = brother + in + law = أخ الزوج/الزوجة"
  },
  {
    q: "What type is 'swimming pool'?",
    options: ["Open", "Closed", "Hyphenated", "None"],
    answer: 0,
    explanation: "swimming pool مركبة مفتوحة - تُكتب كلمتين منفصلتين"
  },
  {
    q: "Which means 'قوس قزح'?",
    options: ["rainbow", "rainfall", "raincoat", "rainstorm"],
    answer: 0,
    explanation: "rainbow = rain + bow = قوس قزح"
  },
  {
    q: "What does 'football' mean?",
    options: ["كرة قدم", "كرة يد", "كرة طاولة", "كرة سلة"],
    answer: 0,
    explanation: "football = foot (قدم) + ball (كرة) = كرة قدم"
  },
  {
    q: "Which is NOT a compound word?",
    options: ["strawberry", "classroom", "the", "toothbrush"],
    answer: 2,
    explanation: "the أداة تعريف فقط وليست كلمة مركبة"
  }
];

const navTabs = document.getElementById('navTabs');
const sections = document.querySelectorAll('.section');

navTabs.addEventListener('click', function(e) {
  const tab = e.target.closest('.nav-tab');
  if (!tab) return;

  const sectionId = tab.dataset.section;
  if (sectionId === currentSection) return;

  navTabs.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
  tab.classList.add('active');

  sections.forEach(s => s.classList.remove('active'));
  document.getElementById('section-' + sectionId).classList.add('active');
  currentSection = sectionId;

  window.scrollTo({ top: 0, behavior: 'smooth' });
});

function speak(text) {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US';
    u.rate = 0.85;
    u.pitch = 1;
    window.speechSynthesis.speak(u);
  }
}

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

let shuffledQuestions;

function startQuiz() {
  currentQuestion = 0;
  score = 0;
  answered = false;
  shuffledQuestions = shuffleArray(questions);
  document.getElementById('btnStart').style.display = 'none';
  showQuestion();
}

function showQuestion() {
  if (currentQuestion >= shuffledQuestions.length) {
    showResult();
    return;
  }

  answered = false;
  const q = shuffledQuestions[currentQuestion];
  const pct = ((currentQuestion) / shuffledQuestions.length) * 100;
  document.getElementById('quizProgressFill').style.width = pct + '%';

  document.getElementById('quizQuestion').textContent =
    `(${currentQuestion + 1}/${shuffledQuestions.length}) ${q.q}`;

  const optsDiv = document.getElementById('quizOptions');
  optsDiv.innerHTML = '';

  q.options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'quiz-opt';
    btn.textContent = opt;
    btn.onclick = () => selectAnswer(i);
    optsDiv.appendChild(btn);
  });

  document.getElementById('quizFeedback').textContent = '';
  document.getElementById('quizFeedback').className = 'quiz-feedback';
  document.getElementById('btnNext').style.display = 'none';
}

function selectAnswer(idx) {
  if (answered) return;
  answered = true;

  const q = shuffledQuestions[currentQuestion];
  const opts = document.querySelectorAll('.quiz-opt');

  opts.forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.answer) btn.classList.add('correct');
    if (i === idx && i !== q.answer) btn.classList.add('wrong');
  });

  const fb = document.getElementById('quizFeedback');
  if (idx === q.answer) {
    score++;
    fb.textContent = '✓ إجابة صحيحة! ' + q.explanation;
    fb.className = 'quiz-feedback good';
  } else {
    fb.textContent = '✗ إجابة خاطئة! ' + q.explanation;
    fb.className = 'quiz-feedback bad';
  }

  document.getElementById('btnNext').style.display = 'inline-flex';
}

function nextQuestion() {
  currentQuestion++;
  showQuestion();
}

function showResult() {
  const total = shuffledQuestions.length;
  const pct = Math.round((score / total) * 100);
  let msg = '';
  if (pct >= 90) msg = 'ممتاز! أنت خبير في الكلمات المركبة! 🌟';
  else if (pct >= 70) msg = 'جيد جداً! واصل التقدم! 👏';
  else if (pct >= 50) msg = 'جيد! حاول مرة أخرى لتحسين نتيجتك 💪';
  else msg = 'حاول مرة أخرى! المراجعة ستساعدك 📖';

  document.getElementById('quizProgressFill').style.width = '100%';
  document.getElementById('quizQuestion').textContent = '';
  document.getElementById('quizOptions').innerHTML = '';
  document.getElementById('quizFeedback').textContent = '';
  document.getElementById('btnNext').style.display = 'none';

  const resultDiv = document.createElement('div');
  resultDiv.className = 'quiz-result';
  resultDiv.innerHTML = `
    <span class="big">${score}/${total}</span>
    <span class="msg">${msg}</span>
    <p style="margin-top:12px;color:#64748b;">النسبة: ${pct}%</p>
    <div style="margin-top:20px;">
      <button class="btn btn-primary" onclick="startQuiz()">أعد الاختبار 🔄</button>
      <button class="btn btn-ghost" onclick="goToSection('open')">مراجعة الدرس 📚</button>
    </div>
  `;
  document.getElementById('quizArea').querySelector('.card .card-body').appendChild(resultDiv);
}

function goToSection(id) {
  navTabs.querySelectorAll('.nav-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.section === id);
  });
  sections.forEach(s => s.classList.remove('active'));
  document.getElementById('section-' + id).classList.add('active');
  currentSection = id;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}