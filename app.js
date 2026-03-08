// =============================================
// CODEBUSTERS PRACTICE APP  v2
// =============================================

let currentCipher = 'aristocrat';
let currentProblem = null;
let timerInterval = null;
let timerSeconds = 0;
let timerRunning = false;
let timerHidden = false;

// =============================================
// TIMER
// =============================================
function formatTime(s) {
  const m = Math.floor(s / 60).toString().padStart(2, '0');
  const sec = (s % 60).toString().padStart(2, '0');
  return `${m}:${sec}`;
}

function startTimer() {
  if (timerRunning) return;
  timerInterval = setInterval(() => {
    timerSeconds++;
    document.getElementById('timerText').textContent = formatTime(timerSeconds);
  }, 1000);
  timerRunning = true;
  document.getElementById('startStopTimer').textContent = '⏸';
}

function stopTimer() {
  if (!timerRunning) return;
  clearInterval(timerInterval);
  timerRunning = false;
  document.getElementById('startStopTimer').textContent = '▶';
}

function resetTimer() {
  stopTimer();
  timerSeconds = 0;
  document.getElementById('timerText').textContent = '00:00';
}

document.getElementById('startStopTimer').addEventListener('click', () => {
  timerRunning ? stopTimer() : startTimer();
});
document.getElementById('resetTimer').addEventListener('click', resetTimer);
document.getElementById('toggleTimer').addEventListener('click', () => {
  timerHidden = !timerHidden;
  document.getElementById('timerDisplay').style.visibility = timerHidden ? 'hidden' : 'visible';
});

// =============================================
// REF GUIDE MODAL
// =============================================
document.getElementById('refGuideBtn').addEventListener('click', () => {
  document.getElementById('refGuideModal').style.display = 'flex';
});
document.getElementById('closeRefGuide').addEventListener('click', () => {
  document.getElementById('refGuideModal').style.display = 'none';
});
document.getElementById('refGuideModal').addEventListener('click', (e) => {
  if (e.target === document.getElementById('refGuideModal')) {
    document.getElementById('refGuideModal').style.display = 'none';
  }
});

// =============================================
// QUOTES
// =============================================
const FALLBACK_QUOTES = [
  "The only way to learn a new programming language is by writing programs in it.",
  "Science is the great antidote to the poison of enthusiasm and superstition.",
  "The good thing about science is that it is true whether or not you believe in it.",
  "In the middle of every difficulty lies opportunity.",
  "The measure of intelligence is the ability to change.",
  "Life is not measured by the number of breaths we take but by the moments that take our breath away.",
  "Knowledge is power and power is knowledge and with that you have the key to the universe.",
  "The secret of getting ahead is getting started.",
  "Do not wait to strike till the iron is hot but make it hot by striking.",
  "Genius is one percent inspiration and ninety nine percent perspiration.",
  "The difference between the impossible and the possible lies in a persons determination.",
  "To know that we know what we know and to know that we do not know what we do not know that is true knowledge.",
  "The art of being wise is the art of knowing what to overlook.",
  "In science it often happens that scientists say you know that is a really good argument my position is mistaken.",
  "The greatest enemy of knowledge is not ignorance it is the illusion of knowledge.",
  "Not everything that can be counted counts and not everything that counts can be counted.",
  "Equipped with his five senses man explores the universe around him and calls the adventure science.",
  "The important thing is to not stop questioning curiosity has its own reason for existing.",
  "Research is to see what everybody else has seen and to think what nobody else has thought.",
  "One of the greatest gifts science has given to humanity is continuing to move the goalposts of ignorance.",
  "Imagination is more important than knowledge for knowledge is limited whereas imagination embraces the entire world.",
  "The first principle is that you must not fool yourself and you are the easiest person to fool.",
  "Science is organized knowledge wisdom is organized life.",
  "Somewhere something incredible is waiting to be known.",
  "It does not matter how slowly you go as long as you do not stop.",
  "Success is not final failure is not fatal it is the courage to continue that counts.",
  "The mind is not a vessel to be filled but a fire to be kindled.",
  "In the beginning was the word and the word was with knowledge and the knowledge was the cipher."
];

function getRandomFallbackQuote() {
  return cleanText(FALLBACK_QUOTES[randInt(0, FALLBACK_QUOTES.length - 1)]);
}

const SHORT_PHRASES = [
  'CODEBUSTERS', 'SCIENCE OLYMPIAD', 'CRYPTOGRAPHY', 'BREAK THE CODE',
  'SECRET MESSAGE', 'CIPHER TEXT', 'MATRIX MATH', 'ENCODE DECODE',
  'SUBSTITUTION', 'FREQUENCY ANALYSIS', 'HIDDEN MESSAGE', 'OLYMPIAD TEAM'
];

function getShortPhrase() {
  return SHORT_PHRASES[randInt(0, SHORT_PHRASES.length - 1)];
}

// =============================================
// NAVIGATION
// =============================================
document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentCipher = btn.dataset.cipher;
    loadCipher(currentCipher);
  });
});

// =============================================
// BEGIN SCREEN
// =============================================
function showBeginScreen(cipherName, typeStr, pts, description) {
  resetTimer();
  document.getElementById('contentArea').innerHTML = `
    <div class="begin-screen">
      <div class="begin-inner">
        <div class="begin-cipher-tag">${typeStr}</div>
        <h2 class="begin-title">${cipherName}</h2>
        <div class="begin-pts">${pts} POINTS</div>
        <p class="begin-desc">${description}</p>
        <button class="btn-begin" onclick="beginProblem()">▶&nbsp; BEGIN</button>
        <div class="begin-meta">Timer starts automatically when you begin.</div>
      </div>
    </div>`;
}

function beginProblem() {
  resetTimer();
  startTimer();
  renderCurrentProblem();
}

// =============================================
// LOAD CIPHER
// =============================================
async function loadCipher(name) {
  const ca = document.getElementById('contentArea');
  ca.innerHTML = `<div class="loading-state">
    <div class="loading-dots"><div class="loading-dot"></div><div class="loading-dot"></div><div class="loading-dot"></div></div>
    <div class="loading-text">Generating problem...</div>
  </div>`;
  await new Promise(r => setTimeout(r, 80));
  await generateProblem(name);
  if (currentProblem) {
    const meta = getCipherMeta(name);
    showBeginScreen(meta.name, meta.type, meta.pts, meta.desc);
  }
}



function renderCurrentProblemCore() {
  if (!currentProblem) return;
  switch (currentProblem.type) {
    case 'aristocrat':  renderAristocratUI(); break;
    case 'porta':       renderPortaUI(); break;
    case 'hill2':
    case 'hill3':       renderHillUI(); break;
    case 'baconian':    renderBaconianUI(); break;
    case 'cryptarithm': renderCryptarithmUI(); break;
  }
}

// =============================================
// GENERATE PROBLEM
// =============================================
async function generateProblemCore(name) {
  switch (name) {
    case 'aristocrat':
    case 'patristocrat': {
      let q = getRandomFallbackQuote();
      while (q.replace(/[^A-Z]/gi,'').length < 45) q = getRandomFallbackQuote();
      const isPat = name === 'patristocrat';
      const kt = ['random','K1','K2'][randInt(0,2)];
      const kr = Aristocrat.generateKey(kt);
      const key = kr.key ? kr : { key: kr };
      const ct = isPat ? Patristocrat.encrypt(q, key.key||key) : Aristocrat.encrypt(q, key.key||key);
      currentProblem = { type:'aristocrat', subtype:name, plaintext:q, ciphertext:ct,
        key:key.key||key, keyType:kr.type||kt, keyword:kr.keyword, isPat, misspelled:false };
      break;
    }
    case 'porta': {
      const q = getRandomFallbackQuote().replace(/[^A-Z ]/gi,'');
      const key = Porta.generateKey();
      currentProblem = { type:'porta', plaintext:q.toUpperCase(), ciphertext:Porta.encrypt(q,key), key };
      break;
    }
    case 'hill2': {
      const ph = getShortPhrase().replace(/[^A-Z]/gi,'');
      const ko = Hill2.generateKey();
      currentProblem = { type:'hill2', plaintext:ph, ciphertext:Hill2.encrypt(ph,ko), key:ko };
      break;
    }
    case 'hill3': {
      const ph = getShortPhrase().replace(/[^A-Z]/gi,'');
      const ko = Hill3.generateKey();
      currentProblem = { type:'hill3', plaintext:ph, ciphertext:Hill3.encrypt(ph,ko), key:ko };
      break;
    }
    case 'baconian': {
      const ph = getShortPhrase();
      const style = randInt(0,3);
      const enc = Baconian.encrypt(ph);
      currentProblem = { type:'baconian', plaintext:ph, ciphertext:enc, baconStyle:style };
      break;
    }
    case 'cryptarithm': {
      currentProblem = { type:'cryptarithm', problem:Cryptarithm.generateKey() };
      break;
    }
  }
}

// =============================================
// HEADER HELPERS
// =============================================
function cipherHeaderHTML(cipher, type, points, controls='') {
  return `<div class="cipher-header">
    <div class="cipher-title-block">
      <h2>${cipher}</h2>
      <div class="cipher-type-tag">${type} &nbsp;|&nbsp; <span class="points-badge">${points} pts</span></div>
    </div>
    <div class="cipher-controls">${controls}</div>
  </div>`;
}

function ctrlBtns(extra='') {
  return `<button class="btn-cipher btn-new" onclick="loadCipher(currentCipher)">◎ NEW</button>
    ${extra}
    <button class="btn-cipher btn-hint" onclick="toggleHint()">? HINT</button>
    <button class="btn-cipher btn-reveal" onclick="showAnswer()">◈ REVEAL</button>`;
}

function checkBtn() { return `<button class="btn-cipher btn-check" onclick="checkAnswer()">✓ CHECK</button>`; }
function doneBtn()  { return `<button class="btn-cipher btn-check" onclick="markDone()" style="border-color:#7a8aaa;color:#7a8aaa;">■ DONE</button>`; }

function toggleHint() {
  const h = document.getElementById('hintPanel');
  if (h) h.classList.toggle('visible');
}

function markDone() {
  stopTimer();
  const t = document.getElementById('timerText').textContent;
  const msg = document.getElementById('statusMsg');
  if (msg) { msg.textContent = `Finished in ${t}`; msg.className='status-msg show correct'; }
}

// =============================================
// FREQUENCY TABLE — numbers only like on paper
// =============================================
function freqTableHTML(ct) {
  const freq = letterFreq(ct);
  const hdr = ALPHABET.split('').map(c=>`<th>${c}</th>`).join('');
  const vals = ALPHABET.split('').map(c=>`<td style="font-size:10px;">${freq[c]||''}</td>`).join('');
  return `<div class="sub-table-container" style="margin-bottom:10px;">
    <div style="font-family:var(--font-tech);font-size:9px;letter-spacing:2px;color:var(--text-dim);margin-bottom:4px;">LETTER FREQUENCY COUNT</div>
    <table class="sub-table" style="min-width:unset;">
      <thead><tr><th style="width:60px;text-align:right;padding-right:8px;font-size:9px;">CT LETTER</th>${hdr}</tr></thead>
      <tbody><tr><td class="row-label" style="font-size:9px;">COUNT</td>${vals}</tr></tbody>
    </table>
  </div>`;
}

// =============================================
// SUBSTITUTION TABLE — NO cross-propagation
// =============================================
function subTableHTML(freq={}) {
  const hdr = ALPHABET.split('').map(c=>`<th>${c}</th>`).join('');
  const frow = `<tr class="freq-row"><td class="row-label" style="font-size:9px">FREQ</td>
    ${ALPHABET.split('').map(c=>`<td style="font-size:10px;color:var(--text-dim);">${freq[c]||''}</td>`).join('')}</tr>`;
  const irow = `<tr><td class="row-label">PLAINTEXT</td>${ALPHABET.split('').map(c=>
    `<td><input class="cell-input" maxlength="1" data-cipher="${c}" id="sub_${c}" oninput="onSubInput(this)" onkeydown="subNavKey(event,this)" /></td>`
  ).join('')}</tr>`;
  return `<div class="sub-table-container"><table class="sub-table">
    <thead><tr><th>CIPHER →</th>${hdr}</tr>${frow}</thead>
    <tbody>${irow}</tbody>
  </table></div>`;
}

function onSubInput(el) {
  const val = el.value.toUpperCase().replace(/[^A-Z]/g,'');
  el.value = val;
  val ? el.classList.add('filled') : el.classList.remove('filled');
  // NO propagation to decode area — advance column only
  if (val) {
    const next = el.closest('td').nextElementSibling;
    if (next) { const ni = next.querySelector('input'); if (ni) ni.focus(); }
  }
}

function subNavKey(e, el) {
  if (e.key === 'Backspace' && el.value === '') {
    const prev = el.closest('td').previousElementSibling;
    if (prev?.querySelector) { const pi = prev.querySelector('input'); if (pi) { pi.value=''; pi.classList.remove('filled'); pi.focus(); } }
  }
}

// =============================================
// DECODE AREA — NO auto-propagation
// =============================================
function buildDecodeArea(cipherText) {
  const words = cipherText.replace(/[^A-Z ]/g,'').split(' ').filter(w=>w.length>0);
  let html = '<div class="decode-area">';
  for (const word of words) {
    html += '<span class="decode-word" style="display:inline-flex;gap:2px;margin-right:14px;margin-bottom:8px;">';
    for (const c of word) {
      if (c >= 'A' && c <= 'Z') {
        html += `<span class="letter-cell">
          <span class="cipher-letter">${c}</span>
          <input class="plain-input" maxlength="1" data-cipher="${c}" oninput="onPlainInput(this)" onkeydown="plainNavKey(event,this)" />
        </span>`;
      }
    }
    html += '</span>';
  }
  return html + '</div>';
}

function onPlainInput(el) {
  const val = el.value.toUpperCase().replace(/[^A-Z]/g,'');
  el.value = val;
  el.classList.remove('correct','incorrect');
  // NO propagation — just advance focus
  if (val) {
    const all = [...document.querySelectorAll('.plain-input')];
    const idx = all.indexOf(el);
    if (idx >= 0 && idx < all.length-1) all[idx+1].focus();
  }
}

function plainNavKey(e, el) {
  if (e.key === 'Backspace' && el.value === '') {
    const all = [...document.querySelectorAll('.plain-input')];
    const idx = all.indexOf(el);
    if (idx > 0) all[idx-1].focus();
  }
}

// =============================================
// RENDER FUNCTIONS
// =============================================
function renderCaesarUI() {
  const {ciphertext:ct} = currentProblem;
  document.getElementById('contentArea').innerHTML = `
    ${cipherHeaderHTML('Caesar Cipher','Monoalphabetic','200',ctrlBtns(checkBtn()+doneBtn()))}
    <div class="hint-panel" id="hintPanel">
      Single-letter words → likely A or I. Double-letter words: test AA, BE, IN, ME, OF, UP, DO, GO, NO.
      Only 25 possible shifts — brute force from a known short word.
    </div>
    <div class="question-card" data-label="CIPHER TEXT — DECODE">
      <div class="cipher-text-display">${ct}</div>
    </div>
    <div class="question-card" data-label="WORK AREA">
      <div style="margin-bottom:10px;display:flex;align-items:center;gap:10px;">
        <span style="font-family:var(--font-tech);font-size:10px;letter-spacing:2px;color:var(--text-dim);">SHIFT:</span>
        <input class="answer-field" id="shiftInput" type="number" min="1" max="25" placeholder="?" style="width:70px;min-width:70px;" />
      </div>
      <div class="answer-input-row">
        <span class="answer-label">Plaintext:</span>
        <input class="answer-field" id="caesarAnswer" placeholder="TYPE YOUR DECODED MESSAGE" style="flex:1;" />
      </div>
      <div id="statusMsg" class="status-msg"></div>
    </div>
    ${freqTableHTML(ct)}`;
}

function renderAtbashUI() {
  const {ciphertext:ct} = currentProblem;
  document.getElementById('contentArea').innerHTML = `
    ${cipherHeaderHTML('Atbash Cipher','Monoalphabetic','150',ctrlBtns(checkBtn()+doneBtn()))}
    <div class="hint-panel" id="hintPanel">
      A↔Z B↔Y C↔X D↔W E↔V F↔U G↔T H↔S I↔R J↔Q K↔P L↔O M↔N. Encoding twice = original.
    </div>
    <div class="question-card" data-label="CIPHER TEXT — DECODE">
      <div class="cipher-text-display">${ct}</div>
    </div>
    <div class="question-card" data-label="WORK AREA">
      <div class="answer-input-row">
        <span class="answer-label">Plaintext:</span>
        <input class="answer-field" id="atbashAnswer" placeholder="TYPE YOUR DECODED MESSAGE" style="flex:1;" />
      </div>
      <div id="statusMsg" class="status-msg"></div>
    </div>
    ${freqTableHTML(ct)}`;
}

function renderAristocratUI() {
  const {ciphertext:ct, isPat, misspelled, keyType} = currentProblem;
  const freq = letterFreq(ct);
  const title = isPat ? 'Patristocrat' : misspelled ? 'Aristocrat (Misspelled)' : 'Aristocrat';
  const pts = isPat ? 250 : misspelled ? 300 : 200;
  document.getElementById('contentArea').innerHTML = `
    ${cipherHeaderHTML(title, isPat?'Monoalphabetic · No Spaces':'Monoalphabetic', pts, ctrlBtns(checkBtn()+doneBtn()))}
    <div class="hint-panel" id="hintPanel">
      Most frequent: E T A O I N S H R D L U C M F W Y P V B G K J Q X Z<br>
      Single-letter words → A or I. Look for contractions, double letters, short words (THE AND IS IT).
      Alphabet: <strong>${(keyType||'RANDOM').toUpperCase()}</strong>
      ${isPat?'<br>All spaces removed, grouped in 5s.':''}
      ${misspelled?'<br>⚠ Homophones/misspellings may be present!':''}
    </div>
    <div class="question-card" data-label="CIPHER TEXT">
      <div class="question-meta">
        <div class="meta-item"><span class="meta-label">Alphabet</span><span class="meta-value highlight">${(keyType||'RANDOM').toUpperCase()}</span></div>
        <div class="meta-item"><span class="meta-label">Length</span><span class="meta-value">${ct.replace(/\s/g,'').length} letters</span></div>
      </div>
      <div class="${isPat?'cipher-grouped':'cipher-text-display'}">${ct}</div>
    </div>
    <div class="question-card" data-label="SUBSTITUTION ALPHABET">
      ${subTableHTML(freq)}
    </div>
    <div class="question-card" data-label="DECODE WORK AREA">
      ${buildDecodeArea(ct)}
    </div>
    <div id="statusMsg" class="status-msg" style="margin-top:8px;"></div>`;
}

function renderAffineUI() {
  const {ciphertext:ct, key:{a,b}} = currentProblem;
  const freq = letterFreq(ct);
  document.getElementById('contentArea').innerHTML = `
    ${cipherHeaderHTML('Affine Cipher','Monoalphabetic Math','250',ctrlBtns(checkBtn()+doneBtn()))}
    <div class="hint-panel" id="hintPanel">
      E(x)=(${a}x+${b}) mod 26 &nbsp;|&nbsp; D(x)=a⁻¹(x−${b}) mod 26<br>
      Valid a values: 1 3 5 7 9 11 15 17 19 21 23 25. Find a⁻¹: t where (t×${a}) mod 26 = 1.
    </div>
    <div class="question-card" data-label="CIPHER INFO">
      <div class="question-meta">
        <div class="meta-item"><span class="meta-label">a</span><span class="meta-value highlight">${a}</span></div>
        <div class="meta-item"><span class="meta-label">b</span><span class="meta-value highlight">${b}</span></div>
        <div class="meta-item"><span class="meta-label">E(x)</span><span class="meta-value">(${a}x + ${b}) mod 26</span></div>
      </div>
      <div class="cipher-text-display">${ct}</div>
    </div>
    <div class="question-card" data-label="SUBSTITUTION ALPHABET">
      ${subTableHTML(freq)}
    </div>
    <div class="question-card" data-label="DECODE WORK AREA">
      ${buildDecodeArea(ct)}
    </div>
    <div id="statusMsg" class="status-msg" style="margin-top:8px;"></div>`;
}

function renderVigenereUI() {
  const {ciphertext:ct, key, plaintext} = currentProblem;
  const hw = plaintext.split(' ').sort((a,b)=>b.length-a.length)[0].toUpperCase();
  const ptns = plaintext.toUpperCase().replace(/[^A-Z]/g,'');
  const ctns = ct.replace(/[^A-Z]/g,'');
  const hi = ptns.indexOf(hw.replace(/[^A-Z]/g,''));
  const hct = hi>=0 ? ctns.slice(hi, hi+hw.length) : '?';
  document.getElementById('contentArea').innerHTML = `
    ${cipherHeaderHTML('Vigenère Cipher','Polyalphabetic','300',ctrlBtns(checkBtn()+doneBtn()))}
    <div class="hint-panel" id="hintPanel">
      To decode: find key letter row → find cipher letter in that row → column header = plaintext.<br>
      Crib: <strong>"${hw}"</strong> → <strong>"${hct}"</strong>. Key length: <strong>${key.length}</strong>.
    </div>
    <div class="question-card" data-label="CIPHER TEXT">
      <div class="question-meta">
        <div class="meta-item"><span class="meta-label">Key Length</span><span class="meta-value highlight">${key.length}</span></div>
        <div class="meta-item"><span class="meta-label">Crib</span><span class="meta-value">"${hw}" → "${hct}"</span></div>
      </div>
      <div class="cipher-text-display">${ct}</div>
    </div>
    <div class="question-card" data-label="KEY ENTRY">
      <div class="answer-input-row">
        <span class="answer-label">Keyword:</span>
        <input class="answer-field" id="vigKeyInput" maxlength="20" placeholder="ENTER KEYWORD TO AUTO-FILL DECODE" style="width:260px;" />
        <button class="btn-cipher btn-hint" onclick="applyVigKey()">APPLY</button>
      </div>
    </div>
    <div class="question-card" data-label="WORK AREA">${buildDecodeArea(ct)}</div>
    <div class="question-card" data-label="VIGENÈRE TABLE">${buildVigenereTable()}</div>
    <div id="statusMsg" class="status-msg" style="margin-top:8px;"></div>`;
}

function applyVigKey() {
  const ki = document.getElementById('vigKeyInput');
  if (!ki?.value) return;
  const key = ki.value.toUpperCase().replace(/[^A-Z]/g,'');
  const dec = Vigenere.decrypt(currentProblem.ciphertext, key).replace(/[^A-Z]/g,'').split('');
  document.querySelectorAll('.plain-input').forEach((inp,i) => { inp.value = dec[i]||''; });
}

function buildVigenereTable() {
  let h = '<div class="vigenere-table-wrap"><table class="vigenere-table"><thead><tr><th></th>';
  for (const c of ALPHABET) h+=`<th>${c}</th>`;
  h+='</tr></thead><tbody>';
  for (const r of ALPHABET) {
    h+=`<tr><td class="row-head">${r}</td>`;
    for (let i=0;i<26;i++) h+=`<td>${numToChar(charToNum(r)+i)}</td>`;
    h+='</tr>';
  }
  return h+'</tbody></table></div>';
}

function renderPortaUI() {
  const {ciphertext:ct, key} = currentProblem;
  document.getElementById('contentArea').innerHTML = `
    ${cipherHeaderHTML('Porta Cipher','Polyalphabetic','300',ctrlBtns(checkBtn()+doneBtn()))}
    <div class="hint-panel" id="hintPanel">
      A–M always maps to N–Z and vice versa. Self-reciprocal — encode with same key to decode.<br>
      Find key letter row → look up cipher letter to get plaintext.
    </div>
    <div class="question-card" data-label="CIPHER TEXT">
      <div class="question-meta"><div class="meta-item"><span class="meta-label">Key Length</span><span class="meta-value highlight">${key.length}</span></div></div>
      <div class="cipher-text-display">${ct}</div>
    </div>
    <div class="question-card" data-label="KEY ENTRY">
      <div class="answer-input-row">
        <span class="answer-label">Keyword:</span>
        <input class="answer-field" id="portaKeyInput" maxlength="20" placeholder="ENTER KEYWORD TO AUTO-FILL DECODE" style="width:260px;" />
        <button class="btn-cipher btn-hint" onclick="applyPortaKey()">APPLY</button>
      </div>
    </div>
    <div class="question-card" data-label="WORK AREA">${buildDecodeArea(ct)}</div>
    <div class="question-card" data-label="PORTA TABLE">${buildPortaTable()}</div>
    <div id="statusMsg" class="status-msg" style="margin-top:8px;"></div>`;
}

function applyPortaKey() {
  const ki = document.getElementById('portaKeyInput');
  if (!ki?.value) return;
  const key = ki.value.toUpperCase().replace(/[^A-Z]/g,'');
  const dec = Porta.decrypt(currentProblem.ciphertext, key).replace(/[^A-Z]/g,'').split('');
  document.querySelectorAll('.plain-input').forEach((inp,i) => { inp.value = dec[i]||''; });
}

function buildPortaTable() {
  let h = '<div class="vigenere-table-wrap"><table class="vigenere-table"><thead><tr><th>Keys</th>';
  for (const c of 'ABCDEFGHIJKLM') h+=`<th>${c}</th>`;
  h+='</tr></thead><tbody>';
  for (const row of Porta.PORTA_TABLE) {
    h+=`<tr><td class="row-head" style="color:var(--accent);font-size:10px;">${row.keys}</td>`;
    for (let i=0;i<13;i++) h+=`<td>${row.cipher[i]||''}</td>`;
    h+='</tr>';
  }
  return h+'</tbody></table></div>';
}

function renderHillUI() {
  const {type, ciphertext:ct, key:ko} = currentProblem;
  const size = type==='hill2' ? 2 : 3;
  const matH = size===2 ? matrix2HTML(ko.key) : matrix3HTML(ko.key);
  const invH = size===2 ? matrix2HTML(Hill2.getInverse(ko.key)) : matrix3HTML(ko.inv);
  document.getElementById('contentArea').innerHTML = `
    ${cipherHeaderHTML(`Hill ${size}×${size}`,'Polyalphabetic Math',size===2?'250':'300',ctrlBtns(checkBtn()+doneBtn()))}
    <div class="hint-panel" id="hintPanel">
      A=0 B=1 … Z=25. Break into groups of ${size}. Multiply inverse matrix × letter vector mod 26.<br>
      For mod 26: divide by 26, subtract integer part, multiply fraction × 26.
    </div>
    <div class="question-card" data-label="CIPHER TEXT">
      <div class="cipher-numeric">${ct}</div>
    </div>
    <div class="question-card" data-label="ENCRYPTION MATRIX">
      <div class="math-block-label">Key Matrix</div><div class="matrix-display">${matH}</div>
    </div>
    <div class="question-card" data-label="DECRYPTION MATRIX — USE THIS">
      <div class="math-block-label">Inverse Matrix</div><div class="matrix-display">${invH}</div>
    </div>
    ${size===2?detInvTableHTML():''}
    <div class="question-card" data-label="ANSWER">
      <div class="answer-input-row">
        <span class="answer-label">Plaintext:</span>
        <input class="answer-field" id="hillAnswer" placeholder="DECODED MESSAGE" style="flex:1;" />
      </div>
      <div id="statusMsg" class="status-msg"></div>
    </div>`;
}

function matrix2HTML(mat) {
  return `<div class="matrix">
    <div class="matrix-row"><div class="matrix-cell">${mat[0][0]}</div><div class="matrix-cell">${mat[0][1]}</div></div>
    <div class="matrix-row"><div class="matrix-cell">${mat[1][0]}</div><div class="matrix-cell">${mat[1][1]}</div></div>
  </div>`;
}
function matrix3HTML(mat) {
  return `<div class="matrix">${mat.map(r=>`<div class="matrix-row">${r.map(c=>`<div class="matrix-cell">${c}</div>`).join('')}</div>`).join('')}</div>`;
}
function detInvTableHTML() {
  const pairs=[[1,1],[3,9],[5,21],[7,15],[9,3],[11,19],[15,7],[17,23],[19,11],[21,5],[23,17],[25,25]];
  return `<div class="question-card" data-label="DET INVERSE TABLE mod 26">
    <table class="sub-table" style="min-width:unset;width:auto;">
      <thead><tr><th style="font-size:9px;padding-right:6px;">det(A)</th>${pairs.map(p=>`<th>${p[0]}</th>`).join('')}</tr></thead>
      <tbody><tr><td class="row-label" style="font-size:9px;">det⁻¹</td>${pairs.map(p=>`<td style="color:var(--accent);font-size:11px;">${p[1]}</td>`).join('')}</tr></tbody>
    </table>
  </div>`;
}

// =============================================
// BACONIAN — multiple styles, no translation shown
// =============================================
function renderBaconianUI() {
  const {ciphertext:encoded, baconStyle} = currentProblem;
  const groups = encoded.split(' ');
  let styleLabel='', displayHTML='';

  if (baconStyle===0) {
    styleLabel='A/B Letter Groups';
    displayHTML=`<div class="cipher-grouped" style="letter-spacing:3px;">${groups.join('&nbsp;&nbsp;')}</div>`;
  } else if (baconStyle===1) {
    styleLabel='Symbol Substitution (▲ or ▼)';
    const sym=groups.map(g=>g.split('').map(c=>c==='A'?'<span style="color:var(--text-dim)">▼</span>':'<span style="color:var(--accent)">▲</span>').join('')).join('&nbsp;&nbsp;');
    displayHTML=`<div style="font-size:20px;line-height:2.6;letter-spacing:5px;">${sym}</div>
    <div style="font-family:var(--font-tech);font-size:9px;color:var(--text-dim);margin-top:6px;">(▲ = B, ▼ = A)</div>`;
  } else if (baconStyle===2) {
    styleLabel='Bold/Regular Steganographic Text';
    const cover='THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG AND THE CAT SAT ON THE MAT NEAR THE WALL BY THE GATE';
    const cl=cover.replace(/\s/g,'').split('');
    const cd=groups.join('').split('');
    let out=''; let ci=0;
    for (let i=0;i<cover.length;i++) {
      if (cover[i]===' '){out+=' ';continue;}
      if (ci<cd.length) {
        out+=cd[ci]==='B'
          ?`<strong style="color:var(--text-primary)">${cover[i]}</strong>`
          :`<span style="color:var(--text-dim)">${cover[i]}</span>`;
        ci++;
      } else {
        out+=`<span style="color:var(--text-dim)">${cover[i]}</span>`;
      }
    }
    displayHTML=`<div style="font-family:var(--font-mono);font-size:14px;line-height:2.2;letter-spacing:2px;word-spacing:8px;">${out}</div>
    <div style="font-family:var(--font-tech);font-size:9px;color:var(--text-dim);margin-top:6px;">Bold letters = B &nbsp;|&nbsp; Regular letters = A &nbsp;|&nbsp; Nulls may appear after message ends</div>`;
  } else {
    styleLabel='Binary Digits (1=B, 0=A)';
    const dig=groups.map(g=>g.split('').map(c=>c==='A'?'0':'1').join('')).join('&nbsp;&nbsp;');
    displayHTML=`<div class="cipher-grouped" style="letter-spacing:2px;">${dig}</div>
    <div style="font-family:var(--font-tech);font-size:9px;color:var(--text-dim);margin-top:4px;">(1 = B, 0 = A)</div>`;
  }

  document.getElementById('contentArea').innerHTML = `
    ${cipherHeaderHTML('Baconian Cipher','Steganography','200',ctrlBtns(checkBtn()+doneBtn()))}
    <div class="hint-panel" id="hintPanel">
      Science Olympiad: 24-letter form (I=J, U=V). Groups of 5.<br>
      No group starts with BB — first two same → both are A.<br>
      Count: A's outnumber B's. All-same group of 5 = letter A.
    </div>
    <div class="question-card" data-label="CIPHER — ${styleLabel}">
      ${displayHTML}
    </div>
    <div class="question-card" data-label="BACONIAN TABLE">
      ${buildBaconianTable()}
    </div>
    <div class="question-card" data-label="WORK AREA — write out each group of 5 then look up">
      <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px;">
        ${groups.map((_,i)=>`<input class="answer-field" style="width:70px;min-width:70px;text-align:center;font-size:12px;" maxlength="5" placeholder="XXXXX" id="bg_${i}" />`).join('')}
      </div>
      <div class="answer-input-row">
        <span class="answer-label">Plaintext:</span>
        <input class="answer-field" id="baconAnswer" placeholder="DECODED MESSAGE" style="flex:1;" />
      </div>
      <div id="statusMsg" class="status-msg"></div>
    </div>`;
}

function buildBaconianTable() {
  return `<div class="baconian-table">${Object.entries(Baconian.TABLE).map(([k,v])=>
    `<div class="baconian-entry"><span class="baconian-letter">${k}</span><span class="baconian-code">${v}</span></div>`
  ).join('')}</div>`;
}

function renderMorbitUI() {
  const {ciphertext:ct} = currentProblem;
  document.getElementById('contentArea').innerHTML = `
    ${cipherHeaderHTML('Morbit Cipher','Tomogrammic','300',ctrlBtns(checkBtn()+doneBtn()))}
    <div class="hint-panel" id="hintPanel">
      Text → Morse code (X=letter/word space) → group into pairs → each pair = one digit.<br>
      9 total pairs: .. .– .X –. –– –X X. X– XX
    </div>
    <div class="question-card" data-label="CIPHER TEXT">
      <div class="cipher-numeric">${ct}</div>
    </div>
    <div class="question-card" data-label="PAIR MAPPING (fill in as you decode)">
      <div style="font-family:var(--font-tech);font-size:9px;letter-spacing:2px;color:var(--text-dim);margin-bottom:8px;">DIGIT → PAIR (.=dot  –=dash  X=space)</div>
      <div class="morbit-map-table">
        ${['1','2','3','4','5','6','7','8','9'].map(d=>`<div class="morbit-cell">
          <div class="morbit-digit">${d}</div>
          <input class="morbit-input-cell" maxlength="3" id="morbit_${d}" placeholder=".–X" />
        </div>`).join('')}
      </div>
    </div>
    <div class="question-card" data-label="MORSE REFERENCE">${buildMorseRef()}</div>
    <div class="question-card" data-label="ANSWER">
      <div class="answer-input-row">
        <span class="answer-label">Plaintext:</span>
        <input class="answer-field" id="morbitAnswer" placeholder="DECODED MESSAGE" style="flex:1;" />
      </div>
      <div id="statusMsg" class="status-msg"></div>
    </div>`;
}

function buildMorseRef() {
  return `<div class="morse-table-compact">${Object.entries(MORSE_TABLE).map(([k,v])=>
    `<div class="morse-entry"><span class="morse-letter">${k}</span><span>${v}</span></div>`
  ).join('')}</div>`;
}

function renderPolluxUI() {
  const {ciphertext:ct} = currentProblem;
  document.getElementById('contentArea').innerHTML = `
    ${cipherHeaderHTML('Pollux Cipher','Tomogrammic','300',ctrlBtns(checkBtn()+doneBtn()))}
    <div class="hint-panel" id="hintPanel">
      Multiple digits → same symbol. No XXX in a row (max 2 consecutive spaces).<br>
      First digit never a space. 6+ non-space in a row → unknown = space.
    </div>
    <div class="question-card" data-label="CIPHER TEXT">
      <div class="cipher-numeric" style="word-break:break-all;">${ct}</div>
    </div>
    <div class="question-card" data-label="DIGIT MAPPING (. – X)">
      <div class="morbit-map-table">
        ${['0','1','2','3','4','5','6','7','8','9'].map(d=>`<div class="morbit-cell">
          <div class="morbit-digit">${d}</div>
          <input class="morbit-input-cell" maxlength="1" id="pollux_${d}" placeholder="?" />
        </div>`).join('')}
      </div>
    </div>
    <div class="question-card" data-label="MORSE REFERENCE">${buildMorseRef()}</div>
    <div class="question-card" data-label="ANSWER">
      <div class="answer-input-row">
        <span class="answer-label">Plaintext:</span>
        <input class="answer-field" id="polluxAnswer" placeholder="DECODED MESSAGE" style="flex:1;" />
      </div>
      <div id="statusMsg" class="status-msg"></div>
    </div>`;
}

function renderRailFenceUI() {
  const {ciphertext:ct, plaintext, key:rails} = currentProblem;
  const clean = plaintext.toUpperCase().replace(/[^A-Z]/g,'');
  const grid = RailFence.getGrid(clean, rails);
  const dlen = Math.min(clean.length, 52);
  let ghtml = `<div style="overflow-x:auto;"><div class="rail-grid" style="grid-template-columns:repeat(${dlen},24px);grid-template-rows:repeat(${rails},24px);">`;
  for (let r=0;r<rails;r++) for (let c=0;c<dlen;c++) {
    const cell = grid[r][c];
    ghtml += cell
      ? `<div class="rail-cell occupied rail-${r}" style="grid-row:${r+1};grid-column:${c+1};">${cell.char}</div>`
      : `<div class="rail-cell" style="grid-row:${r+1};grid-column:${c+1};"></div>`;
  }
  ghtml += '</div></div>';
  if (clean.length>dlen) ghtml+=`<div style="font-family:var(--font-tech);font-size:9px;color:var(--text-dim);margin-top:4px;">+ ${clean.length-dlen} more</div>`;
  document.getElementById('contentArea').innerHTML = `
    ${cipherHeaderHTML('Rail Fence Cipher','Transposition','200',ctrlBtns(checkBtn()+doneBtn()))}
    <div class="hint-panel" id="hintPanel">
      All letters present — just reordered. Zigzag across ${rails} rails, read row by row.<br>
      Decrypt: calculate letters per rail, fill in order, then read zigzag.
    </div>
    <div class="question-card" data-label="CIPHER TEXT">
      <div class="question-meta">
        <div class="meta-item"><span class="meta-label">Rails</span><span class="meta-value highlight">${rails}</span></div>
        <div class="meta-item"><span class="meta-label">Length</span><span class="meta-value">${clean.length}</span></div>
      </div>
      <div class="cipher-grouped">${ct}</div>
    </div>
    <div class="question-card" data-label="ZIGZAG GRID (plaintext shown for reference)">${ghtml}</div>
    <div class="question-card" data-label="ANSWER">
      <div class="answer-input-row">
        <span class="answer-label">Plaintext:</span>
        <input class="answer-field" id="railAnswer" placeholder="DECODED MESSAGE" style="flex:1;" />
      </div>
      <div id="statusMsg" class="status-msg"></div>
    </div>`;
}

function renderCryptarithmUI() {
  const {problem:prob} = currentProblem;
  const letters = [...new Set(prob.equation.replace(/[^A-Z]/g,'').split(''))].sort();
  document.getElementById('contentArea').innerHTML = `
    ${cipherHeaderHTML('Cryptarithm','Mathematical','300',`
      <button class="btn-cipher btn-new" onclick="loadCipher('cryptarithm')">◎ NEW</button>
      ${checkBtn()} ${doneBtn()}
      <button class="btn-cipher btn-hint" onclick="toggleHint()">? HINT</button>
      <button class="btn-cipher btn-reveal" onclick="showAnswer()">◈ REVEAL</button>`)}
    <div class="hint-panel" id="hintPanel">
      Each letter = unique digit (0–9). No leading zeros. Base 10.<br>
      Leading digit of result is often 1 from carry. Work column right-to-left.
    </div>
    <div class="question-card" data-label="EQUATION">
      <div style="font-family:var(--font-mono);font-size:30px;font-weight:700;letter-spacing:8px;text-align:center;padding:20px 0;">${prob.equation}</div>
    </div>
    <div class="question-card" data-label="LETTER → DIGIT">
      <div class="letter-map-grid">
        ${letters.map(l=>`<div class="letter-map-item">
          <div class="lm-letter">${l}</div>
          <input class="lm-digit" maxlength="1" id="lm_${l}" type="number" min="0" max="9" placeholder="?" />
        </div>`).join('')}
      </div>
    </div>
    <div id="statusMsg" class="status-msg" style="margin-top:8px;"></div>`;
}

function misspellQuote(text) {
  const h = {'TO':'TOO','TOO':'TO','THERE':'THEIR','THEIR':'THERE','SEE':'SEA','SEA':'SEE',
    'KNOW':'NO','NO':'KNOW','NEW':'KNEW','RIGHT':'RITE','WRITE':'RIGHT','FOR':'FORE',
    'YOUR':'YORE','YOU':'YEW','BE':'BEE','ONE':'WON','WON':'ONE','SUN':'SON','SON':'SUN'};
  return text.split(' ').map(w => {
    const u=w.toUpperCase();
    return (h[u]&&Math.random()<0.3)?h[u]:w;
  }).join(' ');
}

// =============================================
// CHECK ANSWER
// =============================================
function checkAnswer() {
  if (!currentProblem) return;
  const p = currentProblem;
  let correct=false, msg='';
  const getVal = id => (document.getElementById(id)?.value||'').toUpperCase().replace(/[^A-Z ]/g,'').trim();

  if (p.type==='caesar' || p.type==='atbash') {
    // removed ciphers - no-op
  } else if (p.type==='aristocrat') {
    const inputs=[...document.querySelectorAll('.plain-input')];
    const pt=p.plaintext.toUpperCase().replace(/[^A-Z]/g,'').split('');
    let right=0;
    inputs.forEach((inp,i)=>{
      const val=inp.value.toUpperCase();
      inp.classList.remove('correct','incorrect');
      if(!val) return;
      val===pt[i] ? (right++,inp.classList.add('correct')) : inp.classList.add('incorrect');
    });
    correct=right===pt.length;
    msg=correct?`✓ PERFECT! ${right}/${pt.length}`:`◑ ${right}/${pt.length} correct (${Math.round(right/pt.length*100)}%)`;
  } else if (p.type==='hill2'||p.type==='hill3') {
    const ua=getVal('hillAnswer').replace(/\s/g,'');
    const exp=p.plaintext.toUpperCase().replace(/[^A-Z]/g,'');
    correct=ua===exp; msg=correct?'✓ CORRECT!':`✗ Expected: ${exp}`;
  } else if (p.type==='baconian') {
    const ua=getVal('baconAnswer').replace(/\s/g,'');
    correct=ua===p.plaintext.toUpperCase().replace(/[^A-Z]/g,'');
    msg=correct?'✓ CORRECT!':'✗ INCORRECT';
  } else if (p.type==='cryptarithm') {
    if (p.problem.solution) {
      correct=Object.entries(p.problem.solution).every(([l,d])=>{
        const inp=document.getElementById(`lm_${l}`);
        return inp && parseInt(inp.value)===d;
      });
      msg=correct?'✓ CORRECT!':'✗ Incorrect — check mappings';
    } else { msg='ℹ Multiple solutions possible'; }
  }

  if (correct) stopTimer();
  const el=document.getElementById('statusMsg');
  if (el) { el.textContent=msg; el.className=`status-msg show ${correct?'correct':msg.includes('◑')||msg.includes('ℹ')?'partial':'incorrect'}`; }
}

function compareAnswers(a,b) {
  const al=a.replace(/\s+/g,'').toUpperCase();
  const bl=b.replace(/\s+/g,'').toUpperCase();
  if(al===bl) return 1;
  let m=0;
  for(let i=0;i<Math.min(al.length,bl.length);i++) if(al[i]===bl[i]) m++;
  return m/Math.max(al.length,bl.length);
}

// =============================================
// SHOW ANSWER
// =============================================
function showAnswerCore() {
  if (!currentProblem) return;
  stopTimer();
  const p=currentProblem;
  let html='';
  if (p.type==='cryptarithm') {
    html=`<div class="key-reveal-block"><div class="key-reveal-label">Equation</div><div class="key-reveal-value" style="font-size:22px;">${p.problem.equation}</div></div>`;
    if (p.problem.solution) html+=`<div class="key-reveal-block" style="margin-top:10px;"><div class="key-reveal-label">Solution</div><div class="key-reveal-value">${Object.entries(p.problem.solution).map(([k,v])=>`${k}=${v}`).join('  ')}</div></div>`;
    else html+=`<div style="color:var(--text-secondary);margin-top:10px;">${p.problem.note||'Multiple solutions'}</div>`;
  } else {
    html=`<div class="key-reveal-block"><div class="key-reveal-label">Plaintext Solution</div><div class="solution-text">${p.plaintext.toUpperCase()}</div></div>`;
    if (p.type==='aristocrat') {
      const rows=ALPHABET.split('').map(c=>{const pt=Object.entries(p.key).find(([,v])=>v===c);return `<div class="mapping-item"><div class="mapping-cipher">${c}</div><div class="mapping-plain">${pt?pt[0]:''}</div></div>`;}).join('');
      html+=`<div class="key-reveal-block"><div class="key-reveal-label">Cipher → Plain</div><div class="mapping-strip">${rows}</div></div>`;
      if (p.keyword) html+=`<div class="key-reveal-block"><div class="key-reveal-label">Keyword</div><div class="key-reveal-value">${p.keyword}</div></div>`;
    }
    else if (p.type==='porta') html+=`<div class="key-reveal-block"><div class="key-reveal-label">Keyword</div><div class="key-reveal-value">${p.key}</div></div>`;
    else if (p.type==='hill2'||p.type==='hill3') html+=`<div class="key-reveal-block"><div class="key-reveal-label">Key</div><div class="key-reveal-value">${p.key.word||''}</div></div>`;
    else if (p.type==='baconian') html+=`<div class="key-reveal-block"><div class="key-reveal-label">Encoded</div><div class="key-reveal-value" style="font-size:12px;word-break:break-all;">${p.ciphertext}</div></div>`;
  }
  document.getElementById('answerModalBody').innerHTML=html;
  new bootstrap.Modal(document.getElementById('answerModal')).show();
}

// =============================================
// PRINT TEST
// =============================================
document.getElementById('printTestBtn').addEventListener('click', generatePrintTest);

// All available cipher types for random test generation
const ALL_PRINT_TYPES = [
  'aristocrat','aristocrat','aristocrat',
  'patristocrat','patristocrat',
  'xenocrypt',
  'porta',
  'hill2','hill3',
  'baconian',
  'frac-morse',
  'nihilist',
  'checkerboard',
  'columnar',
  'cryptarithm','cryptarithm',
];

async function generatePrintTest() {
  const btn = document.getElementById('printTestBtn');
  btn.textContent = '⌛ GENERATING...';
  btn.disabled = true;

  const saved = currentProblem;
  const savedCipher = currentCipher;

  // Pick 8 random non-duplicate questions from the pool
  const pool = shuffleArray([...ALL_PRINT_TYPES]);
  const typeCounts = {};
  const chosen = [];
  const maxPerType = { aristocrat: 2, patristocrat: 1, cryptarithm: 1 };
  for (const t of pool) {
    const max = maxPerType[t] || 1;
    typeCounts[t] = (typeCounts[t] || 0);
    if (typeCounts[t] < max) {
      chosen.push(t);
      typeCounts[t]++;
      if (chosen.length === 8) break;
    }
  }

  const problems = [];
  for (const t of chosen) {
    await generateProblem(t);
    if (currentProblem) problems.push({ ...currentProblem, cipherMeta: getCipherMeta(t) });
  }

  currentProblem = saved;
  currentCipher = savedCipher;

  const pw = window.open('', '_blank');
  if (!pw) { alert('Please allow popups to print the test.'); btn.textContent = '⎙ PRINT TEST'; btn.disabled = false; return; }
  pw.document.write(buildPrintHTML(problems));
  pw.document.close();
  pw.focus();
  setTimeout(() => pw.print(), 800);

  btn.textContent = '⎙ PRINT TEST';
  btn.disabled = false;
}

function buildPrintHTML(problems) {
  const today = new Date().toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'});

  // The print canvas is always 816px wide (96dpi * 8.5in).
  // On screen we scale this to fit the viewport using JS below.
  // On print the browser uses @page margins and ignores the pixel sizes.
  const PAGE_W = 816;   // 8.5in @ 96dpi
  const PAGE_H = 1056;  // 11in  @ 96dpi
  const PAD_H  = 58;    // 0.6in top/bottom padding
  const PAD_W  = 67;    // 0.7in left/right padding

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Courier+Prime:ital,wght@0,400;0,700&family=Oswald:wght@400;600;700&display=swap');
    @page { size: letter; margin: 0.6in 0.7in; }

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    html { background: #d0d0d0; }
    body {
      font-family: 'Courier Prime', monospace;
      font-size: 10pt;
      color: #000;
      background: transparent;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
      margin: 0; padding: 0;
    }

    /* Scaler: JS sets --scale and we transform the whole print area */
    #scale-root {
      transform-origin: top center;
      transform: scale(var(--scale, 1));
      width: ${PAGE_W}px;
      margin: 0 auto;
    }
    #print-wrap {
      width: ${PAGE_W}px;
      background: #d0d0d0;
      padding: 24px 0;
    }

    /* Each page is a fixed-size white card */
    .page {
      width: ${PAGE_W}px;
      min-height: ${PAGE_H}px;
      padding: ${PAD_H}px ${PAD_W}px;
      background: #fff;
      margin: 0 auto 24px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.25);
      overflow: hidden;
      position: relative;
    }
    .page:last-child { margin-bottom: 0; }

    /* ---- Typography ---- */
    h1 { font-family: 'Oswald', sans-serif; font-size: 20pt; font-weight: 700; letter-spacing: 5px; text-align: center; line-height: 1.2; }
    .sub { text-align: center; font-size: 9pt; letter-spacing: 3px; margin-bottom: 4px; }

    .info-row { display: flex; gap: 16px; margin: 8px 0 12px; font-size: 9pt; border-top: 2px solid #000; padding-top: 6px; }
    .info-field { display: flex; align-items: baseline; gap: 4px; flex: 1; }
    .info-field span { border-bottom: 1px solid #000; flex: 1; height: 16px; display: inline-block; }

    /* ---- Score table ---- */
    .score-table { width: 100%; border-collapse: collapse; font-size: 8.5pt; margin-bottom: 12px; }
    .score-table th, .score-table td { border: 1px solid #999; padding: 2px 6px; }
    .score-table th { background: #f0f0f0; }

    /* ---- Question blocks ---- */
    .q-block { margin-bottom: 14px; padding-bottom: 10px; border-bottom: 1px solid #ccc; }
    .q-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 2px; }
    .q-num { font-family: 'Oswald', sans-serif; font-size: 12pt; font-weight: 700; letter-spacing: 2px; }
    .q-pts { font-size: 8pt; font-style: italic; }
    .q-type { font-size: 7pt; letter-spacing: 1px; color: #555; margin-bottom: 4px; text-transform: uppercase; }

    /* ---- Cipher text ---- */
    .ct     { font-size: 12pt; font-weight: 700; letter-spacing: 2px; line-height: 1.85; word-spacing: 8px; margin: 4px 0; word-break: break-word; }
    .ct-grp { font-size: 12pt; font-weight: 700; letter-spacing: 2px; line-height: 1.85; word-break: break-all; margin: 4px 0; }
    .ct-num { font-size: 10.5pt; font-weight: 700; letter-spacing: 2px; margin: 4px 0; word-break: break-all; line-height: 1.8; }

    /* ---- Answer line ---- */
    .ans-line { border-bottom: 1px solid #000; height: 20px; width: 100%; margin: 4px 0; }

    /* ---- Frequency + substitution tables ---- */
    /* 26 letters + 1 label col = 27 cols. Page content width = 682px. 682/27 = 25.2px per col */
    .alpha-table { border-collapse: collapse; table-layout: fixed; width: 100%; font-size: 7pt; margin: 3px 0; }
    .alpha-table th, .alpha-table td { border: 1px solid #ccc; text-align: center; padding: 0; overflow: hidden; white-space: nowrap; }
    .alpha-table th { background: #f0f0f0; font-weight: 700; height: 16px; }
    .alpha-table .data-row td { height: 18px; }
    .alpha-table .lbl-col { width: 22px; background: #f5f5f5; font-size: 6pt; font-weight: 700; }
    .alpha-table .letter-col { width: 25px; }

    /* ---- Decoded blanks ---- */
    .decoded-row { font-size: 11pt; letter-spacing: 3px; color: #ccc; line-height: 1.85; word-spacing: 8px; margin: 2px 0; word-break: break-word; }

    /* ---- Matrix ---- */
    .matrix-wrap { display: flex; gap: 24px; align-items: flex-start; margin: 5px 0; flex-wrap: wrap; }
    .matrix-item { display: flex; flex-direction: column; }
    .matrix-label { font-size: 7pt; color: #444; margin-bottom: 2px; }
    .matrix { border-left: 2.5px solid #000; border-right: 2.5px solid #000; padding: 5px 12px; display: inline-flex; flex-direction: column; gap: 4px; }
    .mrow { display: flex; gap: 14px; }
    .mcell { width: 22px; text-align: center; font-weight: 700; font-size: 10pt; }
    .det-ref { font-size: 6pt; color: #666; margin: 2px 0 3px; }

    /* ---- Porta table ---- */
    .port-t { border-collapse: collapse; font-size: 7pt; table-layout: fixed; }
    .port-t th, .port-t td { border: 1px solid #ccc; width: 18px; height: 15px; text-align: center; padding: 0; }
    .port-t th { background: #f0f0f0; }

    /* ---- Baconian ---- */
    .bac-ref { display: grid; grid-template-columns: repeat(7, auto); gap: 2px 10px; font-size: 7.5pt; margin: 4px 0; }
    .bac-entry { display: flex; gap: 5px; }
    .bac-l { font-weight: 700; min-width: 16px; }

    /* ---- Morse ---- */
    .morse-ref { display: grid; grid-template-columns: repeat(7, auto); gap: 1px 8px; font-size: 7pt; }
    .morse-e { display: flex; gap: 3px; }
    .morse-l { font-weight: 700; min-width: 12px; }

    /* ---- Polybius ---- */
    .poly-t { border-collapse: collapse; font-size: 8pt; table-layout: fixed; }
    .poly-t th, .poly-t td { border: 1px solid #aaa; width: 22px; height: 20px; text-align: center; padding: 0; font-weight: 700; }
    .poly-t th { background: #f0f0f0; }

    /* ---- Reference page ---- */
    .ref-lbl { font-size: 7.5pt; font-weight: 700; letter-spacing: 2px; margin: 10px 0 2px; text-transform: uppercase; border-bottom: 1px solid #bbb; padding-bottom: 1px; }
    .ref-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 0 24px; }

    /* ---- Answer key ---- */
    .ak-item { margin-bottom: 7px; padding-bottom: 5px; border-bottom: 1px solid #ddd; }
    .ak-pt { font-size: 10.5pt; font-weight: 700; letter-spacing: 2px; font-family: 'Courier Prime', monospace; }

    /* ===================== PRINT OVERRIDES ===================== */
    @media print {
      html { background: #fff !important; }
      body { background: #fff !important; }
      #scale-root { transform: none !important; width: 100% !important; }
      #print-wrap { background: #fff !important; padding: 0 !important; width: 100% !important; }
      .page {
        width: 100% !important;
        min-height: 0 !important;
        padding: 0 !important;
        margin: 0 !important;
        box-shadow: none !important;
        page-break-after: always;
        break-after: page;
      }
      .page:last-child { page-break-after: avoid; break-after: avoid; }
      .no-print { display: none !important; }
    }
  `;

  const scaleJS = `
    (function() {
      function applyScale() {
        var root = document.getElementById('scale-root');
        if (!root) return;
        var vw = window.innerWidth || document.documentElement.clientWidth;
        var pageW = ${PAGE_W};
        var margin = 32; // px breathing room on each side
        var available = vw - margin * 2;
        var scale = available < pageW ? (available / pageW) : 1;
        root.style.setProperty('--scale', scale);
        // Adjust body height to match scaled content
        var wrap = document.getElementById('print-wrap');
        if (wrap) {
          document.body.style.minHeight = (wrap.offsetHeight * scale + 48) + 'px';
        }
      }
      window.addEventListener('load', applyScale);
      window.addEventListener('resize', applyScale);
    })();
  `;

  let total = 0;
  problems.forEach(p => { total += p.cipherMeta.pts; });

  // Shared alpha table builder
  function alphaTable(headerLabel, dataLabel, dataFn) {
    const cols = ALPHABET.split('').map(c => `<col class="letter-col">`).join('');
    const ths  = ALPHABET.split('').map(c => `<th>${c}</th>`).join('');
    const tds  = ALPHABET.split('').map(c => `<td>${dataFn(c)}</td>`).join('');
    return `<table class="alpha-table">
      <colgroup><col class="lbl-col">${cols}</colgroup>
      <thead><tr><th class="lbl-col">${headerLabel}</th>${ths}</tr></thead>
      <tbody><tr class="data-row"><td class="lbl-col">${dataLabel}</td>${tds}</tr></tbody>
    </table>`;
  }

  const freqTable = (ct) => {
    const freq = letterFreq(ct);
    return alphaTable('F', '', c => freq[c] || '');
  };
  const subTable = () => alphaTable('CT→', 'PT', () => '');

  let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>CodeBusters Practice Test — ${today}</title>
  <style>${css}</style>
</head>
<body>
<div id="scale-root">
<div id="print-wrap">`;

  /* ---- COVER PAGE ---- */
  html += `<div class="page">
  <h1>CODEBUSTERS</h1>
  <div class="sub">DIVISION C &nbsp;|&nbsp; PRACTICE TEST &nbsp;|&nbsp; ${today}</div>
  <div class="info-row">
    <div class="info-field">Team: <span></span></div>
    <div class="info-field" style="max-width:140px;">Time: <span></span></div>
    <div class="info-field" style="max-width:140px;">Score: <span></span></div>
  </div>
  <p style="font-size:8.5pt;margin-bottom:12px;line-height:1.5;"><strong>Instructions:</strong> Decode each cipher as directed. Show all work. No letter maps to itself in substitution ciphers. Up to 2 wrong letters on Aristocrats/Patristocrats still earn partial credit. A non-scientific calculator may be used for math ciphers.</p>
  <table class="score-table">
    <thead><tr><th>#</th><th>Cipher</th><th>Type</th><th style="text-align:center;">Points</th><th style="text-align:center;">Score</th></tr></thead>
    <tbody>`;

  problems.forEach((p, i) => {
    html += `<tr><td>${i+1}</td><td>${p.cipherMeta.name}</td><td style="font-size:7pt;">${p.cipherMeta.type}</td><td style="text-align:center;">${p.cipherMeta.pts}</td><td></td></tr>`;
  });
  html += `<tr><td colspan="3" style="text-align:right;font-weight:700;">TOTAL</td><td style="text-align:center;font-weight:700;">${total}</td><td></td></tr>
    </tbody>
  </table>
</div>`;

  /* ---- QUESTION PAGES ---- */
  // Big questions get their own page; small ones pack 2 per page
  const BIG = new Set(['porta','hill2','hill3','frac-morse','nihilist','xenocrypt','columnar','checkerboard']);
  let pageOpen = false;
  let onPage = 0;

  problems.forEach((p, idx) => {
    const big = BIG.has(p.type);
    if (!pageOpen) { html += '<div class="page">'; pageOpen = true; onPage = 0; }
    else if (big || onPage >= 2) { html += '</div><div class="page">'; onPage = 0; }
    html += buildPrintQ(p, idx + 1, freqTable, subTable);
    onPage++;
    if (big) { html += '</div>'; pageOpen = false; }
  });
  if (pageOpen) { html += '</div>'; pageOpen = false; }

  /* ---- REFERENCE PAGE ---- */
  html += `<div class="page">
  <h1 style="font-size:14pt;margin-bottom:4px;">REFERENCE TABLES</h1>

  <div class="ref-lbl">Alphabet Numbers (A=0 … Z=25)</div>
  ${alphaTable('', '#', (c) => ALPHABET.indexOf(c))}

  <div class="ref-cols">
    <div>
      <div class="ref-lbl">Baconian (24-letter: I=J, U=V)</div>
      <div class="bac-ref">${Object.entries(Baconian.TABLE).map(([k,v])=>`<div class="bac-entry"><span class="bac-l">${k}</span><span>${v}</span></div>`).join('')}</div>
    </div>
    <div>
      <div class="ref-lbl">Morse Code</div>
      <div class="morse-ref">${Object.entries(MORSE_TABLE).filter(([k])=>k>='A'&&k<='Z').map(([k,v])=>`<div class="morse-e"><span class="morse-l">${k}</span><span>${v}</span></div>`).join('')}</div>
    </div>
  </div>

  <div class="ref-lbl">Porta Table</div>
  <table class="port-t"><thead><tr><th>Keys</th>${'ABCDEFGHIJKLM'.split('').map(c=>`<th>${c}</th>`).join('')}</tr></thead>
  <tbody>${Porta.PORTA_TABLE.map(r=>`<tr><th>${r.keys}</th>${r.cipher.split('').map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table>

  <div class="ref-lbl">English Letter Frequency (high → low)</div>
  <div style="font-size:9pt;letter-spacing:3px;font-family:'Courier Prime',monospace;line-height:1.8;">E T A O I N S H R D L U C M F W Y P V B G K J Q X Z</div>

  <div class="ref-lbl">Spanish Letter Frequency (Xenocrypt, high → low)</div>
  <div style="font-size:9pt;letter-spacing:3px;font-family:'Courier Prime',monospace;line-height:1.8;">E A O S N R I L D T U C M P B H Q Y V G F Z J X K W</div>
</div>`;

  /* ---- ANSWER KEY ---- */
  html += `<div class="page"><h1 style="font-size:14pt;margin-bottom:8px;">ANSWER KEY</h1>`;
  problems.forEach((p, i) => {
    html += `<div class="ak-item"><strong>Q${i+1}. ${p.cipherMeta.name}</strong><br>
      <span class="ak-pt">${(p.plaintext || p.problem?.equation || '').toUpperCase()}</span>`;
    if ((p.type==='aristocrat'||p.type==='patristocrat'||p.type==='xenocrypt') && p.keyword) {
      html += ` <span style="font-size:8pt;color:#555;">[Keyword: ${p.keyword} / ${(p.keyType||'').toUpperCase()}]</span>`;
    } else if (p.type==='porta') {
      html += ` <span style="font-size:8pt;color:#555;">[Key: ${p.key}]</span>`;
    } else if (p.type==='hill2'||p.type==='hill3') {
      html += ` <span style="font-size:8pt;color:#555;">[Key: ${p.key.word}]</span>`;
    } else if (p.type==='nihilist') {
      html += ` <span style="font-size:8pt;color:#555;">[Sq: ${p.key.sqKw} / Msg: ${p.key.msgKw}]</span>`;
    } else if (p.type==='columnar') {
      html += ` <span style="font-size:8pt;color:#555;">[Keyword: ${p.key.keyword}]</span>`;
    } else if (p.type==='checkerboard') {
      html += ` <span style="font-size:8pt;color:#555;">[Keyword: ${p.key.keyword}]</span>`;
    } else if (p.type==='frac-morse') {
      html += ` <span style="font-size:8pt;color:#555;">[Keyword: ${p.key.keyword}]</span>`;
    } else if (p.type==='cryptarithm' && p.problem && p.problem.solution) {
      html += `<br><span style="font-size:7.5pt;color:#555;">${Object.entries(p.problem.solution).map(([k,v])=>`${k}=${v}`).join('  ')}</span>`;
    }
    html += '</div>';
  });
  html += `</div>

</div><!-- #print-wrap -->
</div><!-- #scale-root -->
<script>${scaleJS}</script>
</body></html>`;
  return html;
}

function buildPrintQ(p, num, freqTable, subTable) {
  const ct = p.ciphertext || '';
  const decodedBlanks = ct.replace(/[^A-Z ]/g,'').split('').map(c => c === ' ' ? '\u00a0\u00a0' : '_').join('');

  let inner = '';

  /* ---- ARISTOCRAT / XENOCRYPT ---- */
  if (p.type === 'aristocrat' || p.type === 'xenocrypt') {
    const lang = p.type === 'xenocrypt' ? 'SPANISH — ' : '';
    inner = `<div class="q-type">${lang}MONOALPHABETIC SUBSTITUTION — ALPHABET: ${(p.keyType||'RANDOM').toUpperCase()}</div>
    <div class="ct">${ct}</div>
    ${freqTable(ct)}
    ${subTable()}
    <div style="font-size:7pt;margin-top:3px;letter-spacing:1px;">DECODED:</div>
    <div class="decoded-row">${decodedBlanks}</div>`;
    if (p.type === 'xenocrypt') {
      inner += `<div style="font-size:6.5pt;color:#666;margin-top:3px;">Spanish freq: E A O S N R I L D T U C M P B H &nbsp;|&nbsp; Common: DE LA EL EN LOS ES UN QUE CON POR</div>`;
    }

  /* ---- PATRISTOCRAT ---- */
  } else if (p.type === 'patristocrat') {
    inner = `<div class="q-type">MONOALPHABETIC — NO SPACES — ALPHABET: ${(p.keyType||'RANDOM').toUpperCase()}</div>
    <div class="ct-grp">${ct}</div>
    ${freqTable(ct)}
    ${subTable()}
    <div class="ans-line"></div>
    <div class="ans-line" style="margin-top:8px;"></div>`;

  /* ---- PORTA ---- */
  } else if (p.type === 'porta') {
    inner = `<div class="q-type">POLYALPHABETIC — KEY LENGTH: ${(p.key||'').length}</div>
    <div class="ct">${ct}</div>
    <div style="font-size:8.5pt;margin:4px 0;">Key: _______________________________</div>
    <div class="ans-line"></div>
    <div style="margin-top:8px;">
      <table class="port-t"><thead><tr><th>Key</th>${'ABCDEFGHIJKLM'.split('').map(c=>`<th>${c}</th>`).join('')}</tr></thead>
      <tbody>${Porta.PORTA_TABLE.map(r=>`<tr><th>${r.keys}</th>${r.cipher.split('').map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table>
    </div>`;

  /* ---- HILL 2×2 ---- */
  } else if (p.type === 'hill2') {
    const inv = p.key.inv || Hill2.getInverse(p.key.key);
    inner = `<div class="q-type">POLYALPHABETIC MATH — HILL 2×2 — KEY WORD: ${p.key.word}</div>
    <div class="ct-num">${ct}</div>
    <div class="matrix-wrap">
      <div class="matrix-item">
        <div class="matrix-label">Key K &nbsp;(${p.key.word}):</div>
        <div class="matrix">
          <div class="mrow">${p.key.key[0].map(v=>`<div class="mcell">${v}</div>`).join('')}</div>
          <div class="mrow">${p.key.key[1].map(v=>`<div class="mcell">${v}</div>`).join('')}</div>
        </div>
      </div>
      <div class="matrix-item">
        <div class="matrix-label">K&#8315;&#185; — decrypt with this:</div>
        <div class="matrix">
          <div class="mrow">${inv[0].map(v=>`<div class="mcell">${v}</div>`).join('')}</div>
          <div class="mrow">${inv[1].map(v=>`<div class="mcell">${v}</div>`).join('')}</div>
        </div>
      </div>
    </div>
    <div class="det-ref">det&#8315;&#185; mod 26:&nbsp; 1&#8596;1 &nbsp;3&#8596;9 &nbsp;5&#8596;21 &nbsp;7&#8596;15 &nbsp;9&#8596;3 &nbsp;11&#8596;19 &nbsp;15&#8596;7 &nbsp;17&#8596;23 &nbsp;19&#8596;11 &nbsp;21&#8596;5 &nbsp;23&#8596;17 &nbsp;25&#8596;25</div>
    <div class="ans-line"></div>`;

  /* ---- HILL 3×3 ---- */
  } else if (p.type === 'hill3') {
    inner = `<div class="q-type">POLYALPHABETIC MATH — HILL 3×3 — KEY WORD: ${p.key.word}</div>
    <div class="ct-num">${ct}</div>
    <div class="matrix-wrap">
      <div class="matrix-item">
        <div class="matrix-label">Key K &nbsp;(${p.key.word}):</div>
        <div class="matrix">${p.key.key.map(r=>`<div class="mrow">${r.map(v=>`<div class="mcell">${v}</div>`).join('')}</div>`).join('')}</div>
      </div>
      <div class="matrix-item">
        <div class="matrix-label">K&#8315;&#185; — decrypt with this:</div>
        <div class="matrix">${p.key.inv.map(r=>`<div class="mrow">${r.map(v=>`<div class="mcell">${v}</div>`).join('')}</div>`).join('')}</div>
      </div>
    </div>
    <div class="ans-line"></div>`;

  /* ---- BACONIAN ---- */
  } else if (p.type === 'baconian') {
    const groups = ct.split(' ');
    const st = p.baconStyle || 0;
    let disp = '';
    if (st === 0) {
      disp = `<div style="font-size:11pt;letter-spacing:4px;line-height:2;">${groups.join('&nbsp;&nbsp;')}</div>`;
    } else if (st === 1) {
      disp = `<div style="font-size:15pt;letter-spacing:5px;line-height:2.2;">${groups.map(g=>g.split('').map(c=>c==='A'?'&#9660;':'&#9650;').join('')).join('&nbsp;&nbsp;')}</div>
        <div style="font-size:7pt;">(&#9650; = B &nbsp; &#9660; = A)</div>`;
    } else if (st === 2) {
      const cov = 'THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG AND THE CAT SAT ON THE MAT NEAR THE WALL BY THE OLD OAK TREE';
      const cd = groups.join('').split(''); let ci = 0; let out = '';
      for (let i = 0; i < cov.length; i++) {
        if (cov[i] === ' ') { out += ' '; continue; }
        out += ci < cd.length ? (cd[ci] === 'B' ? `<strong>${cov[i]}</strong>` : `${cov[i]}`) : cov[i]; ci++;
      }
      disp = `<div style="font-size:10pt;line-height:2;font-family:'Courier Prime',monospace;">${out}</div>
        <div style="font-size:6.5pt;font-style:italic;">Bold = B &nbsp;|&nbsp; Regular = A</div>`;
    } else {
      disp = `<div style="font-size:11pt;letter-spacing:4px;line-height:2;">${groups.map(g=>g.split('').map(c=>c==='A'?'0':'1').join('')).join('&nbsp;&nbsp;')}</div>
        <div style="font-size:7pt;">(1 = B &nbsp; 0 = A)</div>`;
    }
    inner = `<div class="q-type">STEGANOGRAPHY — BACONIAN 24-LETTER (I=J, U=V)</div>
    ${disp}
    <div class="bac-ref" style="margin-top:6px;">${Object.entries(Baconian.TABLE).map(([k,v])=>`<div class="bac-entry"><span class="bac-l">${k}</span><span>${v}</span></div>`).join('')}</div>
    <div class="ans-line" style="margin-top:6px;"></div>`;

  /* ---- FRACTIONATED MORSE ---- */
  } else if (p.type === 'frac-morse') {
    const crib = p.crib || '';
    const cribMorse = crib.toUpperCase().split('').map(c => MORSE_TABLE[c]||'').join('X');
    // Build trigraph lookup table from the key's encMap
    const syms = ['.', '-', 'X'];
    const hdrCols = syms.flatMap(b => syms.map(a => `<th style="width:18px;font-size:6pt;background:#f0f0f0;text-align:center;">${a}${b}_</th>`)).join('');
    let tRows = '';
    for (const c of syms) {
      let cells = '';
      for (const b of syms) for (const a of syms) {
        const tri = a + b + c;
        cells += `<td style="width:18px;height:14px;text-align:center;border:1px solid #ddd;font-size:7pt;">${(p.key && p.key.encMap && p.key.encMap[tri]) || '?'}</td>`;
      }
      tRows += `<tr><th style="width:20px;font-size:6pt;background:#f0f0f0;padding:0 2px;">${c}__</th>${cells}</tr>`;
    }
    inner = `<div class="q-type">FRACTIONATED MORSE — CRIB: "${crib}" &rarr; MORSE: ${cribMorse}X&hellip;</div>
    <div class="ct-grp">${ct}</div>
    <div style="margin:5px 0;">
      <div style="font-size:6.5pt;font-weight:700;letter-spacing:1px;margin-bottom:2px;">TRIGRAPH TABLE (rows = 3rd symbol; cols = 1st+2nd)</div>
      <table style="border-collapse:collapse;"><thead><tr><th style="width:20px;font-size:6pt;background:#f0f0f0;"></th>${hdrCols}</tr></thead><tbody>${tRows}</tbody></table>
    </div>
    <div class="morse-ref">${Object.entries(MORSE_TABLE).filter(([k])=>k>='A'&&k<='Z').map(([k,v])=>`<div class="morse-e"><span class="morse-l">${k}</span><span>${v}</span></div>`).join('')}</div>
    <div class="ans-line" style="margin-top:4px;"></div>`;

  /* ---- NIHILIST ---- */
  } else if (p.type === 'nihilist') {
    const sqInfo = Nihilist.buildPolybiusKey(p.key.sqKw);
    const cribWord = (p.plaintext || '').split(' ')[0] || '';
    const cribNums = cribWord ? Nihilist.encrypt(cribWord, p.key).split(' ').slice(0, cribWord.replace(/[^A-Z]/gi,'').length).join(' ') : '';
    let sqRows = '';
    for (let r = 0; r < 5; r++) {
      sqRows += `<tr><th>${r+1}</th>${sqInfo.sq[r].map(c=>`<td>${c}</td>`).join('')}</tr>`;
    }
    inner = `<div class="q-type">POLYALPHABETIC MATH — NIHILIST — SQ KEY: ${p.key.sqKw} — MSG KEY LENGTH: ${p.key.msgKw.length}</div>
    <div class="ct-num">${ct}</div>
    <div style="display:flex;gap:20px;align-items:flex-start;margin:5px 0;flex-wrap:wrap;">
      <div>
        <div style="font-size:7pt;font-weight:700;margin-bottom:2px;">POLYBIUS SQUARE (keyword: ${p.key.sqKw})</div>
        <table class="poly-t"><thead><tr><th></th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th></tr></thead>
        <tbody>${sqRows}</tbody></table>
      </div>
      <div style="font-size:8.5pt;padding-top:14px;">
        Crib: <strong>${cribWord}</strong> &#8594; <strong>${cribNums}</strong><br>
        Message keyword length: <strong>${p.key.msgKw.length}</strong>
      </div>
    </div>
    <div style="font-size:8pt;margin:3px 0;">Message Keyword: _______________________</div>
    <div class="ans-line"></div>`;

  /* ---- CHECKERBOARD ---- */
  } else if (p.type === 'checkerboard') {
    let sqRows = '';
    for (let r = 0; r < 5; r++) {
      sqRows += `<tr><th>${r+1}</th>${p.key.sq[r].map(c=>`<td>${c}</td>`).join('')}</tr>`;
    }
    inner = `<div class="q-type">POLYBIUS SQUARE — CHECKERBOARD — KEY: ${p.key.keyword}</div>
    <div class="ct-num">${ct}</div>
    <table class="poly-t" style="margin:5px 0;"><thead><tr><th></th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th></tr></thead>
    <tbody>${sqRows}</tbody></table>
    <div class="ans-line"></div>`;

  /* ---- COMPLETE COLUMNAR ---- */
  } else if (p.type === 'columnar') {
    const n = p.key.colOrder ? p.key.colOrder.length : (p.key.keyword||'').length;
    const cribActual = (p.plaintext||'').toUpperCase().replace(/[^A-Z ]/g,'').slice(0, n + 1);
    inner = `<div class="q-type">TRANSPOSITION — COMPLETE COLUMNAR — ${n} COLUMNS — CRIB: "${cribActual}"</div>
    <div class="ct-grp">${ct}</div>
    <div style="margin:5px 0;">
      <div style="font-size:7pt;font-weight:700;margin-bottom:3px;">KEYWORD &amp; COLUMN READ ORDER (1 = first column read out)</div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;">
        ${(p.key.keyword||'').split('').map((c,i)=>`<div style="text-align:center;min-width:20px;"><div style="font-weight:700;font-size:13pt;font-family:'Courier Prime',monospace;">${c}</div><div style="font-size:8pt;color:#555;">${p.key.colOrder ? p.key.colOrder[i] : ''}</div></div>`).join('')}
      </div>
    </div>
    <div class="ans-line"></div>
    <div class="ans-line" style="margin-top:8px;"></div>`;

  /* ---- CRYPTARITHM ---- */
  } else if (p.type === 'cryptarithm') {
    const lts = [...new Set((p.problem.equation||'').replace(/[^A-Z]/g,'').split(''))].sort();
    inner = `<div class="q-type">MATHEMATICAL — EACH LETTER = UNIQUE DIGIT 0–9, NO LEADING ZEROS</div>
    <div style="font-size:20pt;font-weight:700;letter-spacing:6px;text-align:center;padding:10px 0;font-family:'Courier Prime',monospace;">${p.problem.equation}</div>
    <div style="display:flex;flex-wrap:wrap;gap:5px;margin-bottom:8px;">
      ${lts.map(l=>`<div style="border:1px solid #999;"><div style="font-weight:700;border-bottom:1px solid #999;padding:1px 8px;text-align:center;">${l}</div><div style="height:18px;width:24px;"></div></div>`).join('')}
    </div>`;
  }

  return `<div class="q-block">
  <div class="q-header">
    <span class="q-num">Q${num}. ${p.cipherMeta.name}</span>
    <span class="q-pts">[${p.cipherMeta.pts} pts]</span>
  </div>
  ${inner}
</div>`;
}

// =============================================
// INIT
// =============================================
window.addEventListener('DOMContentLoaded', () => {
  loadCipher('aristocrat');
});

// =============================================
// CIPHER META
// =============================================
function getCipherMetaCore(name) {
  const map = {
    aristocrat:      { name:'Aristocrat',              type:'Monoalphabetic',       pts:200, desc:'Standard substitution cipher with word spaces preserved. No letter maps to itself.' },
    patristocrat:    { name:'Patristocrat',            type:'Monoalphabetic',       pts:250, desc:'Like an Aristocrat but all spaces removed. Letters grouped in sets of 5.' },
    porta:           { name:'Porta Cipher',            type:'Polyalphabetic',       pts:300, desc:'Predecessor to Vigenère with 13 row mappings. Self-reciprocal cipher.' },
    hill2:           { name:'Hill 2×2 Cipher',         type:'Polyalphabetic Math',  pts:250, desc:'Matrix multiplication cipher. Decrypt using the provided inverse matrix.' },
    hill3:           { name:'Hill 3×3 Cipher',         type:'Polyalphabetic Math',  pts:300, desc:'3×3 matrix multiplication cipher. Decryption matrix provided.' },
    baconian:        { name:'Baconian Cipher',         type:'Steganography',        pts:200, desc:'Each letter encoded as 5 A/B characters. Presented with various symbol systems.' },
    cryptarithm:     { name:'Cryptarithm',             type:'Mathematical',         pts:300, desc:'Mathematical equation — each letter represents a unique digit 0–9.' },
  };
  return map[name] || { name: name, type: 'Unknown', pts: 200, desc: '' };
}

// =============================================
// NEW CIPHER META ENTRIES (extend getCipherMeta)
// =============================================
function getCipherMeta(name) {
  const extras = {
    xenocrypt:     { name:'Xenocrypt (Spanish)', type:'Monoalphabetic (Spanish)', pts:300, desc:'Spanish language Aristocrat encoded with K1 or K2 English keyword. Decode the Spanish message.' },
    'frac-morse':  { name:'Fractionated Morse',  type:'Fractionated',            pts:350, desc:'Text converted to Morse, grouped in trigraphs, each encoded as a letter. A crib (4+ chars) is given.' },
    nihilist:      { name:'Nihilist Cipher',     type:'Polyalphabetic Math',     pts:300, desc:'Polybius square numbers added to repeating keyword numbers. Crib given (≤ keyword length).' },
    columnar:      { name:'Complete Columnar',   type:'Transposition',           pts:300, desc:'Text arranged in columns and read out in keyword-alphabetical order. Crib given (≥ columns–1 chars).' },
    checkerboard:  { name:'Checkerboard',        type:'Polybius Square',         pts:250, desc:'Letters encoded as row/column pair from a 5×5 Polybius square built from a keyword.' },
  };
  return extras[name] || getCipherMetaCore(name);
}

// =============================================
// EXTEND generateProblem with new ciphers
// =============================================
async function generateProblem(name) {
  switch(name) {
    case 'xenocrypt': {
      let quote = await Xenocrypt.fetchQuote();
      if (!quote || quote.length < 30) quote = Xenocrypt.SPANISH_FALLBACK[randInt(0,Xenocrypt.SPANISH_FALLBACK.length-1)];
      const kt = ['K1','K2'][randInt(0,1)];
      const kr = Aristocrat.generateKey(kt);
      const key = kr.key ? kr : { key: kr };
      const ct = Aristocrat.encrypt(quote, key.key||key);
      currentProblem = { type:'xenocrypt', plaintext:quote, ciphertext:ct,
        key:key.key||key, keyType:kr.type||kt, keyword:kr.keyword };
      break;
    }
    case 'frac-morse': {
      const phrase = getRandomFallbackQuote().split(' ').slice(0,6).join(' '); // shorter phrase
      const keyObj = FractionatedMorse.generateKey();
      const ct = FractionatedMorse.encrypt(phrase, keyObj);
      // crib: first 4-6 letters
      const cribLen = Math.min(6, phrase.replace(/[^A-Z]/gi,'').length);
      const crib = phrase.toUpperCase().replace(/[^A-Z ]/g,'').slice(0,cribLen);
      currentProblem = { type:'frac-morse', plaintext:phrase, ciphertext:ct, key:keyObj, crib };
      break;
    }
    case 'nihilist': {
      const phrase = SHORT_PHRASES[randInt(0,SHORT_PHRASES.length-1)];
      const keyObj = Nihilist.generateKey();
      const ct = Nihilist.encrypt(phrase, keyObj);
      currentProblem = { type:'nihilist', plaintext:phrase, ciphertext:ct, key:keyObj };
      break;
    }
    case 'columnar': {
      const q = getRandomFallbackQuote();
      const keyObj = CompleteColumnar.generateKey();
      const ct = CompleteColumnar.encrypt(q, keyObj);
      const n = keyObj.colOrder.length;
      const crib = q.toUpperCase().replace(/[^A-Z ]/g,'').slice(0, n);
      currentProblem = { type:'columnar', plaintext:q, ciphertext:ct, key:keyObj, crib };
      break;
    }
    case 'checkerboard': {
      const q = getRandomFallbackQuote();
      const keyObj = Checkerboard.generateKey();
      const ct = Checkerboard.encrypt(q, keyObj);
      currentProblem = { type:'checkerboard', plaintext:q, ciphertext:ct, key:keyObj };
      break;
    }
    default:
      await generateProblemCore(name);
  }
}

// =============================================
// EXTEND renderCurrentProblem
// =============================================
function renderCurrentProblem() {
  if (!currentProblem) return;
  switch(currentProblem.type) {
    case 'xenocrypt':      renderXenocryptUI(); break;
    case 'frac-morse':     renderFracMorseUI(); break;
    case 'nihilist':       renderNihilistUI(); break;
    case 'columnar':       renderColumnarUI(); break;
    case 'checkerboard':   renderCheckerboardUI(); break;
    default:               renderCurrentProblemCore();
  }
}

// =============================================
// XENOCRYPT UI
// =============================================
function renderXenocryptUI() {
  const {ciphertext:ct, keyType, keyword} = currentProblem;
  const freq = letterFreq(ct);
  document.getElementById('contentArea').innerHTML = `
    ${cipherHeaderHTML('Xenocrypt (Spanish)','Monoalphabetic (Spanish)','300',ctrlBtns(checkBtn()+doneBtn()))}
    <div class="hint-panel" id="hintPanel">
      Spanish frequency: E A O S N R I L D T U C M P B H Q Y V G F Z J X K W<br>
      Common Spanish words: DE LA EL EN LOS ES UN QUE CON POR SE<br>
      Encoded with <strong>${(keyType||'K1').toUpperCase()}</strong> English keyword alphabet.
      ${keyword?`Keyword hidden in cipher alphabet.`:''}
    </div>
    <div class="question-card" data-label="CIPHER TEXT (Spanish)">
      <div class="question-meta">
        <div class="meta-item"><span class="meta-label">Language</span><span class="meta-value highlight">ESPAÑOL</span></div>
        <div class="meta-item"><span class="meta-label">Alphabet</span><span class="meta-value highlight">${(keyType||'K1').toUpperCase()}</span></div>
        <div class="meta-item"><span class="meta-label">Length</span><span class="meta-value">${ct.replace(/\s/g,'').length} letters</span></div>
      </div>
      <div class="cipher-text-display">${ct}</div>
    </div>
    <div class="question-card" data-label="SUBSTITUTION ALPHABET">
      ${subTableHTML(freq)}
    </div>
    <div class="question-card" data-label="DECODE WORK AREA">
      ${buildDecodeArea(ct)}
    </div>
    <div id="statusMsg" class="status-msg" style="margin-top:8px;"></div>`;
}

// =============================================
// PORTA CRYPTANALYSIS UI
// =============================================
function renderPortaAnalysisUI() {
  const {ciphertext:ct, key, crib, cribCT} = currentProblem;
  document.getElementById('contentArea').innerHTML = `
    ${cipherHeaderHTML('Porta Cryptanalysis','Polyalphabetic (Crib)','350',ctrlBtns(checkBtn()+doneBtn()))}
    <div class="hint-panel" id="hintPanel">
      Use the crib to identify which Porta row each position maps to, then determine the key letter.<br>
      A–M always maps to N–Z. Crib gives you plaintext/ciphertext pairs to work backwards from key.
    </div>
    <div class="question-card" data-label="CIPHER TEXT">
      <div class="question-meta">
        <div class="meta-item"><span class="meta-label">Crib (plaintext)</span><span class="meta-value highlight">${crib}</span></div>
        <div class="meta-item"><span class="meta-label">Crib (ciphertext)</span><span class="meta-value highlight">${cribCT}</span></div>
      </div>
      <div class="cipher-text-display">${ct}</div>
    </div>
    <div class="question-card" data-label="KEY ENTRY">
      <div class="answer-input-row">
        <span class="answer-label">Keyword:</span>
        <input class="answer-field" id="portaKeyInput" maxlength="20" placeholder="ENTER DISCOVERED KEY" style="width:260px;" />
        <button class="btn-cipher btn-hint" onclick="applyPortaKey()">APPLY</button>
      </div>
    </div>
    <div class="question-card" data-label="WORK AREA">${buildDecodeArea(ct)}</div>
    <div class="question-card" data-label="PORTA TABLE">${buildPortaTable()}</div>
    <div id="statusMsg" class="status-msg" style="margin-top:8px;"></div>`;
}

// =============================================
// FRACTIONATED MORSE UI
// =============================================
function renderFracMorseUI() {
  const {ciphertext:ct, key:keyObj, crib, plaintext} = currentProblem;
  // Show the trigraph alphabet table
  const syms=['.', '-', 'X'];
  let tableHTML = '<div style="overflow-x:auto;"><table class="sub-table" style="font-size:11px;min-width:unset;"><thead><tr>';
  tableHTML += '<th style="font-size:9px;">ROW\\COL</th>';
  const middleSyms = [];
  for (const b of syms) for (const a of syms) middleSyms.push(a+b);
  for (const b of syms) for (const a of syms) tableHTML += `<th style="width:24px;">${a}${b}</th>`;
  tableHTML += '</tr></thead><tbody>';
  for (const c of syms) {
    tableHTML += `<tr><td class="row-label" style="font-size:9px;">${c}__</td>`;
    for (const b of syms) for (const a of syms) {
      const tri = a+b+c;
      tableHTML += `<td style="color:var(--accent);font-size:11px;">${keyObj.encMap[tri]||'?'}</td>`;
    }
    tableHTML += '</tr>';
  }
  tableHTML += '</tbody></table></div>';

  // Crib: first 4-6 letters → show their morse representation
  const cribMorse = crib.split('').map(c=>MORSE_TABLE[c]).join('X')+' ';

  document.getElementById('contentArea').innerHTML = `
    ${cipherHeaderHTML('Fractionated Morse','Fractionated','350',ctrlBtns(checkBtn()+doneBtn()))}
    <div class="hint-panel" id="hintPanel">
      Plaintext → Morse (X = separator) → group trigraphs → each trigraph = one letter.<br>
      Use the crib to fill in known trigraph → letter mappings, then propagate.
    </div>
    <div class="question-card" data-label="CIPHER TEXT">
      <div class="question-meta">
        <div class="meta-item"><span class="meta-label">Crib (plaintext start)</span><span class="meta-value highlight">${crib}</span></div>
        <div class="meta-item"><span class="meta-label">Crib Morse</span><span class="meta-value" style="font-size:11px;">${cribMorse}</span></div>
      </div>
      <div class="cipher-grouped">${ct}</div>
    </div>
    <div class="question-card" data-label="TRIGRAPH TABLE (fill in as you decode)">
      ${tableHTML}
    </div>
    <div class="question-card" data-label="MORSE REFERENCE">${buildMorseRef()}</div>
    <div class="question-card" data-label="ANSWER">
      <div class="answer-input-row">
        <span class="answer-label">Plaintext:</span>
        <input class="answer-field" id="fracMorseAnswer" placeholder="DECODED MESSAGE" style="flex:1;" />
      </div>
      <div id="statusMsg" class="status-msg"></div>
    </div>`;
}

// =============================================
// NIHILIST UI
// =============================================
function renderNihilistUI() {
  const {ciphertext:ct, key:keyObj} = currentProblem;
  const sqInfo = Nihilist.buildPolybiusKey(keyObj.sqKw);
  // Build polybius table HTML
  let sqHTML = '<table class="sub-table" style="width:auto;min-width:unset;"><thead><tr><th></th>';
  for (let c=1;c<=5;c++) sqHTML+=`<th>${c}</th>`;
  sqHTML+='</tr></thead><tbody>';
  for (let r=0;r<5;r++) {
    sqHTML+=`<tr><td class="row-label">${r+1}</td>`;
    for (let c=0;c<5;c++) sqHTML+=`<td style="color:var(--accent);font-weight:700;">${sqInfo.sq[r][c]}</td>`;
    sqHTML+='</tr>';
  }
  sqHTML+='</tbody></table>';

  // crib: plaintext word
  const cribWord = currentProblem.plaintext.split(' ')[0];
  const cribNums = Nihilist.encrypt(cribWord, keyObj).split(' ').slice(0,cribWord.length).join(' ');

  document.getElementById('contentArea').innerHTML = `
    ${cipherHeaderHTML('Nihilist Cipher','Polyalphabetic Math','300',ctrlBtns(checkBtn()+doneBtn()))}
    <div class="hint-panel" id="hintPanel">
      Polybius square key: <strong>${keyObj.sqKw}</strong>. Message key: length ≤ ${keyObj.msgKw.length} letters.<br>
      Encode each plaintext letter and keyword letter via Polybius, add their numbers together.<br>
      Crib: first word is <strong>${cribWord}</strong>, encodes as <strong>${cribNums}</strong>.
    </div>
    <div class="question-card" data-label="CIPHER TEXT (space-separated numbers)">
      <div class="cipher-numeric" style="letter-spacing:4px;">${ct}</div>
    </div>
    <div class="question-card" data-label="POLYBIUS SQUARE (key: ${keyObj.sqKw})">
      ${sqHTML}
    </div>
    <div class="question-card" data-label="ANSWER">
      <div class="answer-input-row">
        <span class="answer-label">Message Key:</span>
        <input class="answer-field" id="nihilistKeyInput" maxlength="20" placeholder="DISCOVERED KEY" style="width:200px;" />
        &nbsp;<span style="font-size:10px;color:var(--text-dim);">Key length: ${keyObj.msgKw.length}</span>
      </div>
      <div class="answer-input-row" style="margin-top:8px;">
        <span class="answer-label">Plaintext:</span>
        <input class="answer-field" id="nihilistAnswer" placeholder="DECODED MESSAGE" style="flex:1;" />
      </div>
      <div id="statusMsg" class="status-msg"></div>
    </div>`;
}

// =============================================
// COMPLETE COLUMNAR UI
// =============================================
function renderColumnarUI() {
  const {ciphertext:ct, key:keyObj, crib, plaintext} = currentProblem;
  const n = keyObj.colOrder.length;
  const cribLen = Math.max(n-1, 4);
  const cribActual = plaintext.toUpperCase().replace(/[^A-Z ]/g,'').slice(0, cribLen);

  document.getElementById('contentArea').innerHTML = `
    ${cipherHeaderHTML('Complete Columnar','Transposition','300',ctrlBtns(checkBtn()+doneBtn()))}
    <div class="hint-panel" id="hintPanel">
      Keyword: <strong>${keyObj.keyword}</strong> (${n} columns). Columns read in alphabetical order of keyword letters.<br>
      Crib allows you to identify column order. Crib length ≥ ${n-1} ensures overlap between columns.
    </div>
    <div class="question-card" data-label="CIPHER TEXT">
      <div class="question-meta">
        <div class="meta-item"><span class="meta-label">Columns</span><span class="meta-value highlight">${n}</span></div>
        <div class="meta-item"><span class="meta-label">Crib (start of plaintext)</span><span class="meta-value highlight">${cribActual}</span></div>
      </div>
      <div class="cipher-grouped">${ct}</div>
    </div>
    <div class="question-card" data-label="KEYWORD">
      <div style="display:flex;gap:6px;align-items:flex-end;flex-wrap:wrap;">
        ${keyObj.keyword.split('').map((c,i)=>`<div style="text-align:center;">
          <div style="font-family:var(--font-mono);font-size:18px;font-weight:700;color:var(--accent);">${c}</div>
          <div style="font-size:10px;color:var(--text-dim);">${keyObj.colOrder[i]}</div>
        </div>`).join('')}
      </div>
      <div style="font-size:10px;color:var(--text-dim);margin-top:8px;">Keyword letter → column read order (1=first column read)</div>
    </div>
    <div class="question-card" data-label="ANSWER">
      <div class="answer-input-row">
        <span class="answer-label">Plaintext:</span>
        <input class="answer-field" id="columnarAnswer" placeholder="DECODED MESSAGE" style="flex:1;" />
      </div>
      <div id="statusMsg" class="status-msg"></div>
    </div>`;
}

// =============================================
// CHECKERBOARD UI
// =============================================
function renderCheckerboardUI() {
  const {ciphertext:ct, key:keyObj} = currentProblem;
  let sqHTML = '<table class="sub-table" style="width:auto;min-width:unset;"><thead><tr><th></th>';
  for (let c=1;c<=5;c++) sqHTML+=`<th>${c}</th>`;
  sqHTML+='</tr></thead><tbody>';
  for (let r=0;r<5;r++) {
    sqHTML+=`<tr><td class="row-label">${r+1}</td>`;
    for (let c=0;c<5;c++) sqHTML+=`<td style="color:var(--accent);font-weight:700;">${keyObj.sq[r][c]}</td>`;
    sqHTML+='</tr>';
  }
  sqHTML+='</tbody></table>';

  document.getElementById('contentArea').innerHTML = `
    ${cipherHeaderHTML('Checkerboard (Polybius)','Polybius Square','250',ctrlBtns(checkBtn()+doneBtn()))}
    <div class="hint-panel" id="hintPanel">
      Each letter encoded as row/column pair. I and J share a cell.<br>
      Find the plaintext letter at the intersection of the given row and column.
    </div>
    <div class="question-card" data-label="CIPHER TEXT (row-col pairs)">
      <div class="cipher-numeric" style="letter-spacing:4px;">${ct}</div>
    </div>
    <div class="question-card" data-label="POLYBIUS SQUARE (keyword: ${keyObj.keyword})">
      ${sqHTML}
    </div>
    <div class="question-card" data-label="ANSWER">
      <div class="answer-input-row">
        <span class="answer-label">Plaintext:</span>
        <input class="answer-field" id="checkerboardAnswer" placeholder="DECODED MESSAGE" style="flex:1;" />
      </div>
      <div id="statusMsg" class="status-msg"></div>
    </div>`;
}

// =============================================
// EXTEND checkAnswer for new ciphers
// =============================================
const _origCheckAnswer = checkAnswer;
function checkAnswer() {
  if (!currentProblem) return;
  const p = currentProblem;
  const newTypes = ['xenocrypt','frac-morse','nihilist','columnar','checkerboard'];
  if (!newTypes.includes(p.type)) { _origCheckAnswer(); return; }

  let correct=false, msg='';
  const getVal = id => (document.getElementById(id)?.value||'').toUpperCase().replace(/[^A-Z ]/g,'').trim();

  if (p.type==='xenocrypt') {
    const inputs=[...document.querySelectorAll('.plain-input')];
    const pt=p.plaintext.toUpperCase().replace(/[^A-Z]/g,'').split('');
    let right=0;
    inputs.forEach((inp,i)=>{
      const val=inp.value.toUpperCase();
      inp.classList.remove('correct','incorrect');
      if(!val) return;
      val===pt[i] ? (right++,inp.classList.add('correct')) : inp.classList.add('incorrect');
    });
    correct=right===pt.length;
    msg=correct?`✓ PERFECT! ${right}/${pt.length}`:`◑ ${right}/${pt.length} (${Math.round(right/pt.length*100)}%)`;
  } else if (p.type==='frac-morse') {
    const m=compareAnswers(getVal('fracMorseAnswer'), p.plaintext.toUpperCase().replace(/[^A-Z ]/g,'').trim());
    correct=m>0.92; msg=correct?'✓ CORRECT!':m>0.7?`◑ CLOSE — ${Math.round(m*100)}%`:'✗ INCORRECT';
  } else if (p.type==='nihilist') {
    const m=compareAnswers(getVal('nihilistAnswer'), p.plaintext.toUpperCase().replace(/[^A-Z ]/g,'').trim());
    correct=m>0.92; msg=correct?'✓ CORRECT!':'✗ INCORRECT';
  } else if (p.type==='columnar') {
    const m=compareAnswers(getVal('columnarAnswer'), p.plaintext.toUpperCase().replace(/[^A-Z ]/g,'').trim());
    correct=m>0.9; msg=correct?'✓ CORRECT!':'✗ INCORRECT';
  } else if (p.type==='checkerboard') {
    const m=compareAnswers(getVal('checkerboardAnswer'), p.plaintext.toUpperCase().replace(/[^A-Z ]/g,'').trim());
    correct=m>0.92; msg=correct?'✓ CORRECT!':'✗ INCORRECT';
  }

  if(correct) stopTimer();
  const el=document.getElementById('statusMsg');
  if(el){ el.textContent=msg; el.className=`status-msg show ${correct?'correct':msg.includes('◑')?'partial':'incorrect'}`; }
}

// =============================================
// EXTEND showAnswer for new ciphers
// =============================================
function showAnswer() {
  if (!currentProblem) return;
  const p = currentProblem;
  const newTypes = ['xenocrypt','frac-morse','nihilist','columnar','checkerboard'];
  if (!newTypes.includes(p.type)) { showAnswerCore(); return; }
  stopTimer();

  let html = `<div class="key-reveal-block"><div class="key-reveal-label">Plaintext Solution</div><div class="solution-text">${(p.plaintext||'').toUpperCase()}</div></div>`;

  if (p.type==='xenocrypt') {
    html += `<div class="key-reveal-block"><div class="key-reveal-label">Alphabet Type</div><div class="key-reveal-value">${(p.keyType||'').toUpperCase()}</div></div>`;
    if(p.keyword) html+=`<div class="key-reveal-block"><div class="key-reveal-label">Keyword</div><div class="key-reveal-value">${p.keyword}</div></div>`;
  } else if (p.type==='frac-morse') {
    html+=`<div class="key-reveal-block"><div class="key-reveal-label">Keyword</div><div class="key-reveal-value">${p.key.keyword}</div></div>`;
  } else if (p.type==='nihilist') {
    html+=`<div class="key-reveal-block"><div class="key-reveal-label">Message Key</div><div class="key-reveal-value">${p.key.msgKw}</div></div>`;
    html+=`<div class="key-reveal-block"><div class="key-reveal-label">Square Keyword</div><div class="key-reveal-value">${p.key.sqKw}</div></div>`;
  } else if (p.type==='columnar') {
    html+=`<div class="key-reveal-block"><div class="key-reveal-label">Keyword</div><div class="key-reveal-value">${p.key.keyword}</div></div>`;
  } else if (p.type==='checkerboard') {
    html+=`<div class="key-reveal-block"><div class="key-reveal-label">Polybius Keyword</div><div class="key-reveal-value">${p.key.keyword}</div></div>`;
  }

  document.getElementById('answerModalBody').innerHTML=html;
  new bootstrap.Modal(document.getElementById('answerModal')).show();
}

// =============================================
// EXTEND print test to include new ciphers
// =============================================
const _origGeneratePrintTest = generatePrintTest;
async function generatePrintTest() {
  const btn = document.getElementById('printTestBtn');
  btn.textContent = '⌛ GENERATING...';
  btn.disabled = true;

  const saved = currentProblem;
  const savedCipher = currentCipher;

  const types = ['aristocrat','patristocrat','xenocrypt','porta','hill2','hill3','baconian','frac-morse','nihilist','checkerboard','columnar','cryptarithm'];
  const problems = [];
  for (const t of types) {
    await generateProblem(t);
    if (currentProblem) problems.push({ ...currentProblem, cipherMeta: getCipherMeta(t) });
  }

  currentProblem = saved;
  currentCipher = savedCipher;

  const pw = window.open('','_blank','width=900,height=700');
  pw.document.write(buildPrintHTML(problems));
  pw.document.close();
  pw.focus();
  setTimeout(() => pw.print(), 600);

  btn.textContent = '⎙ PRINT TEST';
  btn.disabled = false;
}