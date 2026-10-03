const $ = id => document.getElementById(id);

/* ---------- Story steps ---------- */
const steps = [
  ["Hi Emira 🌸", "I made this little place just for you. Tap the button, okay?"],
  ["I'm sorry", "Last night I went to sleep and I didn't say goodbye. I should have told you, and I'm really sorry for that."],
  ["I'm so happy...", "You text me every day, you're a really special friend, and you're so cute. I hope I can make you happy too."],
  ["One question", "Sorry for my English, haha. So... can you forgive me, and can we be okay again?"]
];
let i = 0;
$('next').onclick = () => {
  i++;
  $('title').textContent = steps[i][0];
  $('text').textContent = steps[i][1];
  if (i === steps.length - 1) {
    $('btns').classList.add('hide');
    $('ask').classList.remove('hide');
  } else {
    $('next').textContent = "Next 💙";
  }
};

/* ---------- Falling petals ---------- */
function petals(n) {
  for (let k = 0; k < n; k++) {
    const p = document.createElement('div');
    p.className = 'petal';
    p.style.left = Math.random() * 100 + 'vw';
    p.style.setProperty('--dx', (Math.random() * 160 - 80) + 'px');
    p.style.animationDuration = (5 + Math.random() * 7) + 's';
    p.style.animationDelay = (-Math.random() * 8) + 's';
    p.style.transform = 'scale(' + (.6 + Math.random() * .8) + ')';
    document.body.appendChild(p);
    if (n > 60) setTimeout(() => p.remove(), 9000);
  }
}
petals(22);

/* ---------- "No" runs away, "Yes" celebrates ---------- */
const no = $('no');
function dodge() {
  no.style.left = (Math.random() * 120 - 60) + 'px';
  no.style.top = (Math.random() * 80 - 40) + 'px';
}
no.addEventListener('mouseover', dodge);
no.addEventListener('touchstart', e => { e.preventDefault(); dodge(); });
no.onclick = dodge;

$('yes').onclick = () => {
  $('ask').classList.add('hide');
  $('title').textContent = "Thank you 💗";
  $('text').textContent = "You just made my day, Emira. Let's go back to our long chats. Promise I'll say goodbye properly next time 🌸";
  petals(120);
};

/* ---------- 3D tilt ---------- */
const card = $('card');
addEventListener('pointermove', e => {
  const x = (e.clientX / innerWidth - .5) * 14;
  const y = (e.clientY / innerHeight - .5) * -14;
  card.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
});

/* ---------- Cute floating emojis (visible when music is off) ---------- */
const cute = $('cute'), em = ['💗', '⭐', '✨', '💙', '🫧', '🌸'];
for (let k = 0; k < 22; k++) {
  const e = document.createElement('span');
  e.className = 'fl';
  e.textContent = em[k % em.length];
  e.style.left = Math.random() * 100 + 'vw';
  e.style.fontSize = (14 + Math.random() * 22) + 'px';
  e.style.setProperty('--dx', (Math.random() * 120 - 60) + 'px');
  e.style.animationDuration = (7 + Math.random() * 9) + 's';
  e.style.animationDelay = (-Math.random() * 12) + 's';
  cute.appendChild(e);
}

/* ---------- Backup melody (used only if song.mp3 fails) ---------- */
let ac = null, tm = null, st = 0;
const N = [392,440,523,659,523,440,392,330,392,440,523,440,392,330,294,330];
const B = [196,196,262,262,175,175,196,196];

function tone(fr, t, d, v, ty) {
  const o = ac.createOscillator(), g = ac.createGain();
  o.type = ty; o.frequency.value = fr;
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(v, t + .02);
  g.gain.exponentialRampToValueAtTime(.0001, t + d);
  o.connect(g); g.connect(ac.destination);
  o.start(t); o.stop(t + d + .05);
}
function tick() {
  const t = ac.currentTime + .05;
  tone(N[st % 16], t, 1.4, .16, 'sine');
  tone(N[st % 16] * 2, t, .8, .04, 'triangle');
  if (st % 2 === 0) tone(B[(st / 2) % 8], t, 1.8, .1, 'triangle');
  st++;
}
function startMelody() {
  if (tm) return;
  try {
    ac = new (window.AudioContext || window.webkitAudioContext)();
    ac.resume(); st = 0; tick(); tm = setInterval(tick, 520);
  } catch (e) {}
}
function stopMelody() {
  if (!tm) return;
  clearInterval(tm); tm = null;
  try { ac.close(); } catch (e) {}
}

/* ---------- MP3 music ---------- */
const audio = new Audio('song.mp3');
audio.loop = true;
audio.preload = 'auto';

function setMusic(on) {
  $('on').setAttribute('aria-pressed', on);
  $('off').setAttribute('aria-pressed', !on);
  document.body.classList.toggle('off', !on);
  if (on) {
    audio.play().catch(() => startMelody());
  } else {
    audio.pause();
    audio.currentTime = 0;
    stopMelody();
  }
}
$('on').onclick = () => setMusic(true);
$('off').onclick = () => setMusic(false);