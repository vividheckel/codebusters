// =============================================
// CODEBUSTERS PRACTICE APP  v2
// =============================================

let currentCipher = 'caesar';
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
    case 'caesar':      renderCaesarUI(); break;
    case 'atbash':      renderAtbashUI(); break;
    case 'aristocrat':  renderAristocratUI(); break;
    case 'affine':      renderAffineUI(); break;
    case 'vigenere':    renderVigenereUI(); break;
    case 'porta':       renderPortaUI(); break;
    case 'hill2':
    case 'hill3':       renderHillUI(); break;
    case 'baconian':    renderBaconianUI(); break;
    case 'morbit':      renderMorbitUI(); break;
    case 'pollux':      renderPolluxUI(); break;
    case 'railfence':   renderRailFenceUI(); break;
    case 'cryptarithm': renderCryptarithmUI(); break;
  }
}

// =============================================
// GENERATE PROBLEM
// =============================================
async function generateProblemCore(name) {
  switch (name) {
    case 'caesar': {
      const q = getRandomFallbackQuote();
      const shift = Caesar.generateKey();
      currentProblem = { type:'caesar', plaintext:q, ciphertext:Caesar.encrypt(q,shift), key:shift };
      break;
    }
    case 'atbash': {
      const q = getRandomFallbackQuote();
      currentProblem = { type:'atbash', plaintext:q, ciphertext:Atbash.encrypt(q) };
      break;
    }
    case 'aristocrat':
    case 'aristocrat-mis':
    case 'patristocrat': {
      let q = getRandomFallbackQuote();
      while (q.replace(/[^A-Z]/gi,'').length < 45) q = getRandomFallbackQuote();
      const mis = name === 'aristocrat-mis';
      const isPat = name === 'patristocrat';
      if (mis) q = misspellQuote(q);
      const kt = ['random','K1','K2'][randInt(0,2)];
      const kr = Aristocrat.generateKey(kt);
      const key = kr.key ? kr : { key: kr };
      const ct = isPat ? Patristocrat.encrypt(q, key.key||key) : Aristocrat.encrypt(q, key.key||key);
      currentProblem = { type:'aristocrat', subtype:name, plaintext:q, ciphertext:ct,
        key:key.key||key, keyType:kr.type||kt, keyword:kr.keyword, isPat, misspelled:mis };
      break;
    }
    case 'affine': {
      const q = getRandomFallbackQuote();
      const {a,b} = Affine.generateKey();
      currentProblem = { type:'affine', plaintext:q, ciphertext:Affine.encrypt(q,{a,b}), key:{a,b} };
      break;
    }
    case 'vigenere': {
      const q = getRandomFallbackQuote();
      const key = Vigenere.generateKey();
      currentProblem = { type:'vigenere', plaintext:q, ciphertext:Vigenere.encrypt(q,key), key };
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
    case 'morbit': {
      const ph = getShortPhrase();
      const key = Morbit.generateKey();
      currentProblem = { type:'morbit', plaintext:ph, ciphertext:Morbit.encrypt(ph,key), key };
      break;
    }
    case 'pollux': {
      const ph = getShortPhrase();
      const ko = Pollux.generateKey();
      currentProblem = { type:'pollux', plaintext:ph, ciphertext:Pollux.encrypt(ph,ko), key:ko };
      break;
    }
    case 'railfence': {
      const q = getRandomFallbackQuote();
      const rails = RailFence.generateKey();
      currentProblem = { type:'railfence', plaintext:q, ciphertext:RailFence.encrypt(q,rails), key:rails };
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

  if (p.type==='caesar') {
    const m = compareAnswers(getVal('caesarAnswer'), p.plaintext.toUpperCase().replace(/[^A-Z ]/g,'').trim());
    correct=m>=0.98; msg=correct?'✓ CORRECT!':m>0.8?`◑ CLOSE — ${Math.round(m*100)}%`:'✗ INCORRECT';
  } else if (p.type==='atbash') {
    const m = compareAnswers(getVal('atbashAnswer'), p.plaintext.toUpperCase().replace(/[^A-Z ]/g,'').trim());
    correct=m>=0.98; msg=correct?'✓ CORRECT!':m>0.8?`◑ ${Math.round(m*100)}%`:'✗ INCORRECT';
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
  } else if (p.type==='affine') {
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
    msg=correct?'✓ CORRECT!':`◑ ${right}/${pt.length} (${Math.round(right/pt.length*100)}%)`;
  } else if (p.type==='vigenere'||p.type==='porta') {
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
    msg=correct?'✓ CORRECT!':`◑ ${right}/${pt.length} (${Math.round(right/pt.length*100)}%)`;
  } else if (p.type==='hill2'||p.type==='hill3') {
    const ua=getVal('hillAnswer').replace(/\s/g,'');
    const exp=p.plaintext.toUpperCase().replace(/[^A-Z]/g,'');
    correct=ua===exp; msg=correct?'✓ CORRECT!':`✗ Expected: ${exp}`;
  } else if (p.type==='baconian') {
    const ua=getVal('baconAnswer').replace(/\s/g,'');
    correct=ua===p.plaintext.toUpperCase().replace(/[^A-Z]/g,'');
    msg=correct?'✓ CORRECT!':'✗ INCORRECT';
  } else if (p.type==='morbit') {
    const m=compareAnswers(getVal('morbitAnswer'), p.plaintext.toUpperCase().replace(/[^A-Z ]/g,'').trim());
    correct=m>0.9; msg=correct?'✓ CORRECT!':'✗ INCORRECT';
  } else if (p.type==='pollux') {
    const m=compareAnswers(getVal('polluxAnswer'), p.plaintext.toUpperCase().replace(/[^A-Z ]/g,'').trim());
    correct=m>0.9; msg=correct?'✓ CORRECT!':'✗ INCORRECT';
  } else if (p.type==='railfence') {
    const m=compareAnswers(getVal('railAnswer'), p.plaintext.toUpperCase().replace(/[^A-Z ]/g,'').trim());
    correct=m>0.9; msg=correct?'✓ CORRECT!':'✗ INCORRECT';
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
    if (p.type==='caesar') html+=`<div class="key-reveal-block"><div class="key-reveal-label">Shift</div><div class="key-reveal-value">ROT-${p.key}</div></div>`;
    else if (p.type==='affine') html+=`<div class="key-reveal-block"><div class="key-reveal-label">Keys</div><div class="key-reveal-value">a=${p.key.a}  b=${p.key.b}</div></div>`;
    else if (p.type==='aristocrat') {
      const rows=ALPHABET.split('').map(c=>{const pt=Object.entries(p.key).find(([,v])=>v===c);return `<div class="mapping-item"><div class="mapping-cipher">${c}</div><div class="mapping-plain">${pt?pt[0]:''}</div></div>`;}).join('');
      html+=`<div class="key-reveal-block"><div class="key-reveal-label">Cipher → Plain</div><div class="mapping-strip">${rows}</div></div>`;
      if (p.keyword) html+=`<div class="key-reveal-block"><div class="key-reveal-label">Keyword</div><div class="key-reveal-value">${p.keyword}</div></div>`;
    }
    else if (p.type==='vigenere'||p.type==='porta') html+=`<div class="key-reveal-block"><div class="key-reveal-label">Keyword</div><div class="key-reveal-value">${p.key}</div></div>`;
    else if (p.type==='hill2'||p.type==='hill3') html+=`<div class="key-reveal-block"><div class="key-reveal-label">Key</div><div class="key-reveal-value">${p.key.word||''}</div></div>`;
    else if (p.type==='baconian') html+=`<div class="key-reveal-block"><div class="key-reveal-label">Encoded</div><div class="key-reveal-value" style="font-size:12px;word-break:break-all;">${p.ciphertext}</div></div>`;
    else if (p.type==='morbit') html+=`<div class="key-reveal-block"><div class="key-reveal-label">Pair Mapping</div><div class="key-reveal-value" style="font-size:12px;">${Morbit.PAIRS.map(pair=>`${pair}→${p.key[pair]}`).join('  ')}</div></div>`;
    else if (p.type==='pollux') html+=`<div class="key-reveal-block"><div class="key-reveal-label">Digit Mapping</div><div class="key-reveal-value" style="font-size:12px;">Dots:${p.key.dots.join(',')}  Dashes:${p.key.dashes.join(',')}  Spaces:${p.key.spaces.join(',')}</div></div>`;
    else if (p.type==='railfence') html+=`<div class="key-reveal-block"><div class="key-reveal-label">Rails</div><div class="key-reveal-value">${p.key}</div></div>`;
  }
  document.getElementById('answerModalBody').innerHTML=html;
  new bootstrap.Modal(document.getElementById('answerModal')).show();
}

// =============================================
// PRINT TEST
// =============================================
document.getElementById('printTestBtn').addEventListener('click', generatePrintTest);

async function generatePrintTest() {
  const btn = document.getElementById('printTestBtn');
  btn.textContent = '⌛ GENERATING...';
  btn.disabled = true;

  const saved = currentProblem;
  const savedCipher = currentCipher;

  const types = ['caesar','aristocrat','patristocrat','vigenere','porta','hill2','affine','baconian','morbit','railfence','cryptarithm'];
  const problems = [];
  for (const t of types) {
    await generateProblem(t);
    if (currentProblem) problems.push({ ...currentProblem, cipherMeta: getCipherMeta(t) });
  }

  // Restore state
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

function buildPrintHTML(problems) {
  const today = new Date().toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'});
  let html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>CodeBusters Practice Test</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Courier+Prime:ital,wght@0,400;0,700&family=Oswald:wght@400;600;700&display=swap');
    *{box-sizing:border-box;margin:0;padding:0;}
    body{font-family:'Courier Prime',monospace;background:#fff;color:#000;font-size:11pt;}
    .page{width:8.5in;min-height:11in;padding:0.65in 0.75in;page-break-after:always;}
    .page:last-child{page-break-after:avoid;}
    h1{font-family:'Oswald',sans-serif;font-size:22pt;font-weight:700;letter-spacing:6px;text-align:center;}
    .sub{text-align:center;font-size:10pt;letter-spacing:3px;margin-bottom:4px;}
    .info-row{display:flex;justify-content:space-between;margin:10px 0 16px;font-size:10pt;border-top:2px solid #000;padding-top:8px;}
    .info-row span{border-bottom:1px solid #000;min-width:130px;display:inline-block;}
    .score-table{width:100%;border-collapse:collapse;font-size:9pt;margin-bottom:16px;}
    .score-table th,.score-table td{border:1px solid #999;padding:3px 8px;}
    .score-table th{background:#f0f0f0;}
    .q-block{margin-bottom:20px;padding-bottom:16px;border-bottom:1px solid #ccc;}
    .q-header{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:4px;}
    .q-num{font-family:'Oswald',sans-serif;font-size:13pt;font-weight:700;letter-spacing:2px;}
    .q-pts{font-size:9pt;font-style:italic;}
    .q-type{font-size:8pt;letter-spacing:2px;color:#555;margin-bottom:5px;text-transform:uppercase;}
    .ct{font-family:'Courier Prime',monospace;font-size:13pt;font-weight:700;letter-spacing:2px;line-height:2;word-spacing:10px;margin:6px 0;}
    .ct-grp{font-family:'Courier Prime',monospace;font-size:13pt;font-weight:700;letter-spacing:2px;line-height:2;word-break:break-word;margin:6px 0;}
    .ct-num{font-family:'Courier Prime',monospace;font-size:13pt;font-weight:700;letter-spacing:3px;margin:6px 0;}
    .ans-line{border-bottom:1px solid #000;height:24px;width:100%;margin:6px 0;}
    .freq-t{border-collapse:collapse;font-size:8pt;margin:4px 0;}
    .freq-t th,.freq-t td{border:1px solid #ccc;width:20px;height:16px;text-align:center;padding:0;}
    .freq-t th{background:#f0f0f0;font-weight:700;}
    .sub-t{border-collapse:collapse;font-size:8pt;margin:4px 0;}
    .sub-t th,.sub-t td{border:1px solid #999;width:24px;height:22px;text-align:center;padding:0;}
    .sub-t th{background:#f0f0f0;}
    .matrix{border-left:2px solid #000;border-right:2px solid #000;padding:4px 8px;display:inline-flex;flex-direction:column;gap:4px;}
    .mrow{display:flex;gap:12px;}
    .mcell{width:24px;text-align:center;font-weight:700;}
    .vig-t{border-collapse:collapse;font-size:7pt;}
    .vig-t th,.vig-t td{border:1px solid #ddd;width:14px;height:14px;text-align:center;padding:0;}
    .vig-t th{background:#f5f5f5;}
    .port-t{border-collapse:collapse;font-size:8pt;}
    .port-t th,.port-t td{border:1px solid #ccc;width:20px;height:17px;text-align:center;padding:0;}
    .port-t th{background:#f0f0f0;}
    .bac-t{display:grid;grid-template-columns:repeat(6,auto);gap:2px 10px;font-size:9pt;margin:4px 0;}
    .bac-entry{display:flex;gap:5px;}
    .bac-l{font-weight:700;min-width:14px;}
    .morse-ref{display:grid;grid-template-columns:repeat(6,auto);gap:1px 8px;font-size:8pt;margin:4px 0;}
    .morse-e{display:flex;gap:4px;}
    .morse-l{font-weight:700;min-width:14px;}
    @media print{body{-webkit-print-color-adjust:exact;}.page{page-break-after:always;}.page:last-child{page-break-after:avoid;}}
  </style></head><body>`;

  // Cover page
  html += `<div class="page">
    <h1>CODEBUSTERS</h1>
    <div class="sub">DIVISION C — PRACTICE TEST &nbsp;|&nbsp; ${today}</div>
    <div class="info-row">
      <div>Team: <span style="min-width:200px;"></span></div>
      <div>Time: <span style="min-width:80px;"></span></div>
      <div>Score: <span style="min-width:80px;"></span></div>
    </div>
    <p style="font-size:9pt;margin-bottom:14px;line-height:1.5;">
      <strong>Instructions:</strong> Decode each cipher as directed. Show all work. 
      No letter maps to itself in substitution ciphers (except Caesar/Affine). 
      Up to 2 wrong letters on Aristocrats/Patristocrats still earn partial credit. 
      A non-scientific calculator may be used for math ciphers.
    </p>
    <table class="score-table"><thead><tr><th>#</th><th>Cipher</th><th>Type</th><th>Points</th><th>Score</th></tr></thead><tbody>`;
  let total=0;
  problems.forEach((p,i) => {
    total+=p.cipherMeta.pts;
    html+=`<tr><td>${i+1}</td><td>${p.cipherMeta.name}</td><td style="font-size:8pt;">${p.cipherMeta.type}</td><td style="text-align:center;">${p.cipherMeta.pts}</td><td></td></tr>`;
  });
  html+=`<tr><td colspan="3" style="text-align:right;font-weight:700;">TOTAL</td><td style="text-align:center;font-weight:700;">${total}</td><td></td></tr>`;
  html+='</tbody></table></div>';

  // Question pages
  let pageHtml='<div class="page">';
  let onPage=0;
  const bigQ=['vigenere','porta','hill2','hill3','morbit','pollux'];

  problems.forEach((p,idx) => {
    pageHtml += buildPrintQ(p, idx+1);
    onPage++;
    const needsNewPage = bigQ.includes(p.type) || onPage>=2;
    if (needsNewPage && idx < problems.length-1) {
      pageHtml+='</div><div class="page">';
      onPage=0;
    }
  });
  pageHtml+='</div>';
  html+=pageHtml;

  // Reference tables page
  html+=`<div class="page">
    <h1 style="font-size:16pt;margin-bottom:12px;">REFERENCE TABLES</h1>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px;">
      <div>
        <div style="font-size:9pt;font-weight:700;letter-spacing:2px;margin-bottom:4px;">ALPHABET NUMBERS</div>
        <table class="freq-t"><thead><tr>${ALPHABET.split('').map(c=>`<th>${c}</th>`).join('')}</tr></thead>
        <tbody><tr>${ALPHABET.split('').map((_,i)=>`<td>${i}</td>`).join('')}</tr></tbody></table>
      </div>
      <div>
        <div style="font-size:9pt;font-weight:700;letter-spacing:2px;margin-bottom:4px;">ATBASH</div>
        <table class="freq-t"><thead><tr>${ALPHABET.split('').map(c=>`<th>${c}</th>`).join('')}</tr></thead>
        <tbody><tr>${ALPHABET.split('').map((_,i)=>`<td>${ALPHABET[25-i]}</td>`).join('')}</tr></tbody></table>
      </div>
    </div>
    <div style="margin-bottom:14px;">
      <div style="font-size:9pt;font-weight:700;letter-spacing:2px;margin-bottom:4px;">AFFINE det(A)⁻¹ TABLE (mod 26)</div>
      <table class="freq-t"><thead><tr><th>a</th>${[1,3,5,7,9,11,15,17,19,21,23,25].map(v=>`<th>${v}</th>`).join('')}</tr></thead>
      <tbody><tr><td style="font-weight:700;">a⁻¹</td>${[1,9,21,15,3,19,7,23,11,5,17,25].map(v=>`<td>${v}</td>`).join('')}</tr></tbody></table>
    </div>
    <div style="margin-bottom:14px;">
      <div style="font-size:9pt;font-weight:700;letter-spacing:2px;margin-bottom:4px;">BACONIAN TABLE (24-LETTER FORM)</div>
      <div class="bac-t">${Object.entries(Baconian.TABLE).map(([k,v])=>`<div class="bac-entry"><span class="bac-l">${k}</span><span>${v}</span></div>`).join('')}</div>
    </div>
    <div style="margin-bottom:14px;">
      <div style="font-size:9pt;font-weight:700;letter-spacing:2px;margin-bottom:4px;">MORSE CODE</div>
      <div class="morse-ref">${Object.entries(MORSE_TABLE).map(([k,v])=>`<div class="morse-e"><span class="morse-l">${k}</span><span>${v}</span></div>`).join('')}</div>
    </div>
    <div style="margin-bottom:10px;">
      <div style="font-size:9pt;font-weight:700;letter-spacing:2px;margin-bottom:4px;">PORTA TABLE</div>
      <table class="port-t"><thead><tr><th>Keys</th>${'ABCDEFGHIJKLM'.split('').map(c=>`<th>${c}</th>`).join('')}</tr></thead>
      <tbody>${Porta.PORTA_TABLE.map(r=>`<tr><th>${r.keys}</th>${r.cipher.split('').map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table>
    </div>
  </div>`;

  // Answer key
  html+=`<div class="page"><h1 style="font-size:16pt;margin-bottom:12px;">ANSWER KEY</h1>`;
  problems.forEach((p,i) => {
    html+=`<div style="margin-bottom:10px;padding-bottom:8px;border-bottom:1px solid #ddd;">
      <strong>Q${i+1}. ${p.cipherMeta.name}</strong><br>
      <span style="font-family:'Courier Prime',monospace;font-size:12pt;font-weight:700;letter-spacing:2px;">${(p.plaintext||p.problem?.equation||'').toUpperCase()}</span>`;
    if (p.type==='caesar') html+=` &nbsp;<span style="font-size:9pt;">[Shift: ${p.key}]</span>`;
    else if (p.type==='affine') html+=` &nbsp;<span style="font-size:9pt;">[a=${p.key.a}, b=${p.key.b}]</span>`;
    else if (p.type==='vigenere'||p.type==='porta') html+=` &nbsp;<span style="font-size:9pt;">[Key: ${p.key}]</span>`;
    else if (p.type==='railfence') html+=` &nbsp;<span style="font-size:9pt;">[Rails: ${p.key}]</span>`;
    else if (p.type==='morbit') html+=`<br><span style="font-size:8pt;">${Morbit.PAIRS.map(pair=>`${pair}=${p.key[pair]}`).join(' ')}</span>`;
    else if (p.type==='pollux') html+=`<br><span style="font-size:8pt;">Dots:${p.key.dots.join(',')} Dashes:${p.key.dashes.join(',')} Spaces:${p.key.spaces.join(',')}</span>`;
    else if (p.type==='cryptarithm'&&p.problem.solution) html+=`<br><span style="font-size:9pt;">${Object.entries(p.problem.solution).map(([k,v])=>`${k}=${v}`).join(' ')}</span>`;
    html+='</div>';
  });
  html+='</div></body></html>';
  return html;
}

function buildPrintQ(p, num) {
  const ct = p.ciphertext||'';
  const freq = p.plaintext ? letterFreq(ct) : {};
  const fhdr = ALPHABET.split('').map(c=>`<th>${c}</th>`).join('');
  const fvals = ALPHABET.split('').map(c=>`<td>${freq[c]||''}</td>`).join('');
  const freqT = `<table class="freq-t" style="margin:4px 0;"><thead><tr><th style="background:#e8e8e8">F</th>${fhdr}</tr></thead><tbody><tr><td></td>${fvals}</tr></tbody></table>`;
  const subT = `<table class="sub-t" style="margin:4px 0;"><thead><tr><th>→</th>${ALPHABET.split('').map(c=>`<th>${c}</th>`).join('')}</tr></thead><tbody><tr><td style="background:#f0f0f0;font-size:7pt;">PT</td>${ALPHABET.split('').map(()=>`<td></td>`).join('')}</tr></tbody></table>`;

  let inner='';
  if (p.type==='caesar') {
    inner=`<div class="q-type">Monoalphabetic Shift</div><div style="font-size:9pt;margin-bottom:4px;">Find the shift and decode.</div>
    <div class="ct">${ct}</div>${freqT}
    <div style="font-size:9pt;margin-top:6px;">Shift: ______ &nbsp;&nbsp;&nbsp; Plaintext:</div><div class="ans-line"></div>`;
  } else if (p.type==='atbash') {
    inner=`<div class="q-type">Monoalphabetic</div><div class="ct">${ct}</div>
    <div style="font-size:9pt;margin-top:6px;">Plaintext:</div><div class="ans-line"></div>`;
  } else if (p.type==='aristocrat') {
    inner=`<div class="q-type">Monoalphabetic — Alphabet: ${(p.keyType||'RANDOM').toUpperCase()}</div>
    <div class="ct">${ct}</div>${freqT}${subT}
    <div style="font-size:8pt;margin-top:4px;letter-spacing:1px;">DECODED:</div>
    <div class="ct" style="font-weight:400;letter-spacing:3px;color:#aaa;">${ct.replace(/[^A-Z ]/g,'').split('').map(c=>c===' '?'&nbsp;&nbsp;':'_').join('')}</div>`;
  } else if (p.type==='patristocrat') {
    inner=`<div class="q-type">Monoalphabetic No Spaces — Alphabet: ${(p.keyType||'RANDOM').toUpperCase()}</div>
    <div class="ct-grp">${ct}</div>${freqT}${subT}
    <div class="ans-line"></div><div class="ans-line"></div>`;
  } else if (p.type==='affine') {
    inner=`<div class="q-type">Monoalphabetic Math &nbsp;|&nbsp; E(x) = (${p.key.a}x + ${p.key.b}) mod 26</div>
    <div class="ct">${ct}</div>${freqT}${subT}
    <div class="ans-line"></div>`;
  } else if (p.type==='vigenere') {
    const hw=(p.plaintext||'').split(' ').sort((a,b)=>b.length-a.length)[0]?.toUpperCase()||'';
    const ptns=(p.plaintext||'').toUpperCase().replace(/[^A-Z]/g,'');
    const ctns=ct.replace(/[^A-Z]/g,'');
    const hi=ptns.indexOf(hw.replace(/[^A-Z]/g,''));
    const hct=hi>=0?ctns.slice(hi,hi+hw.length):'?';
    inner=`<div class="q-type">Polyalphabetic &nbsp;|&nbsp; Key Length: ${(p.key||'').length} &nbsp;|&nbsp; Crib: "${hw}"→"${hct}"</div>
    <div class="ct">${ct}</div>
    <div style="font-size:9pt;margin:4px 0;">Key: _______________________</div>
    <div class="ans-line"></div>
    <table class="vig-t" style="margin-top:8px;"><thead><tr><th></th>${ALPHABET.split('').map(c=>`<th>${c}</th>`).join('')}</tr></thead><tbody>
    ${ALPHABET.split('').map(r=>`<tr><th>${r}</th>${Array.from({length:26},(_,i)=>`<td>${numToChar(charToNum(r)+i)}</td>`).join('')}</tr>`).join('')}
    </tbody></table>`;
  } else if (p.type==='porta') {
    inner=`<div class="q-type">Polyalphabetic &nbsp;|&nbsp; Key Length: ${(p.key||'').length}</div>
    <div class="ct">${ct}</div>
    <div style="font-size:9pt;margin:4px 0;">Key: _______________________</div>
    <div class="ans-line"></div>
    <table class="port-t" style="margin-top:6px;"><thead><tr><th>Keys</th>${'ABCDEFGHIJKLM'.split('').map(c=>`<th>${c}</th>`).join('')}</tr></thead>
    <tbody>${Porta.PORTA_TABLE.map(r=>`<tr><th>${r.keys}</th>${r.cipher.split('').map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  } else if (p.type==='hill2') {
    const inv=Hill2.getInverse(p.key.key);
    inner=`<div class="q-type">Polyalphabetic Math</div>
    <div class="ct-num">${ct}</div>
    <div style="display:flex;gap:16px;align-items:center;margin:6px 0;flex-wrap:wrap;">
      <div><div style="font-size:8pt;">Key K:</div><div class="matrix"><div class="mrow"><div class="mcell">${p.key.key[0][0]}</div><div class="mcell">${p.key.key[0][1]}</div></div><div class="mrow"><div class="mcell">${p.key.key[1][0]}</div><div class="mcell">${p.key.key[1][1]}</div></div></div></div>
      <div><div style="font-size:8pt;">K⁻¹ (decrypt with this):</div><div class="matrix"><div class="mrow"><div class="mcell">${inv[0][0]}</div><div class="mcell">${inv[0][1]}</div></div><div class="mrow"><div class="mcell">${inv[1][0]}</div><div class="mcell">${inv[1][1]}</div></div></div></div>
    </div>
    <div style="font-size:7pt;margin-bottom:4px;">det⁻¹: 1↔1 3↔9 5↔21 7↔15 9↔3 11↔19 15↔7 17↔23 19↔11 21↔5 23↔17 25↔25</div>
    <div class="ans-line"></div>`;
  } else if (p.type==='hill3') {
    inner=`<div class="q-type">Polyalphabetic Math</div>
    <div class="ct-num">${ct}</div>
    <div style="margin:6px 0;"><div style="font-size:8pt;">K⁻¹ (decrypt with this):</div>
    <div class="matrix">${p.key.inv.map(r=>`<div class="mrow">${r.map(c=>`<div class="mcell">${c}</div>`).join('')}</div>`).join('')}</div></div>
    <div class="ans-line"></div>`;
  } else if (p.type==='baconian') {
    const groups=ct.split(' ');
    const st=p.baconStyle||0;
    let disp='';
    if(st===0) disp=`<div style="font-family:'Courier Prime',monospace;font-size:12pt;letter-spacing:4px;line-height:2.2;">${groups.join('&nbsp; ')}</div>`;
    else if(st===1) disp=`<div style="font-size:16pt;letter-spacing:5px;line-height:2.4;">${groups.map(g=>g.split('').map(c=>c==='A'?'▼':'▲').join('')).join('&nbsp; ')}</div><p style="font-size:8pt;">(▲=B, ▼=A)</p>`;
    else if(st===2){
      const cov='THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG AND THE CAT SAT ON THE MAT';
      const cl=cov.replace(/\s/g,'').split('');const cd=groups.join('').split('');
      let out='';let ci=0;
      for(let i=0;i<cov.length;i++){if(cov[i]===' '){out+=' ';continue;}out+=ci<cd.length?(cd[ci]==='B'?`<strong>${cov[i]}</strong>`:`${cov[i]}`):cov[i];ci++;}
      disp=`<div style="font-family:'Courier Prime',monospace;font-size:11pt;line-height:2;">${out}</div><p style="font-size:7pt;font-style:italic;">Bold=B, Regular=A</p>`;
    } else disp=`<div style="font-family:'Courier Prime',monospace;font-size:12pt;letter-spacing:4px;line-height:2.2;">${groups.map(g=>g.split('').map(c=>c==='A'?'0':'1').join('')).join('&nbsp; ')}</div><p style="font-size:8pt;">(1=B, 0=A)</p>`;
    inner=`<div class="q-type">Steganography — 24-letter form (I=J, U=V)</div>${disp}
    <div class="ans-line"></div>`;
  } else if (p.type==='morbit') {
    inner=`<div class="q-type">Tomogrammic — Morse code pairs as digits 1–9</div>
    <div class="ct-num" style="letter-spacing:4px;">${ct}</div>
    <div style="display:flex;gap:4px;flex-wrap:wrap;margin:6px 0;">
      ${['1','2','3','4','5','6','7','8','9'].map(d=>`<div style="border:1px solid #999;"><div style="text-align:center;font-weight:700;border-bottom:1px solid #999;padding:1px 4px;">${d}</div><div style="height:16px;width:34px;"></div></div>`).join('')}
    </div>
    <div class="morse-ref" style="font-size:8pt;">${Object.entries(MORSE_TABLE).map(([k,v])=>`<div class="morse-e"><span class="morse-l">${k}</span><span>${v}</span></div>`).join('')}</div>
    <div class="ans-line"></div>`;
  } else if (p.type==='pollux') {
    inner=`<div class="q-type">Tomogrammic — single Morse symbols as digits 0–9</div>
    <div class="ct-num" style="letter-spacing:3px;word-break:break-all;">${ct}</div>
    <div style="display:flex;gap:4px;flex-wrap:wrap;margin:6px 0;">
      ${['0','1','2','3','4','5','6','7','8','9'].map(d=>`<div style="border:1px solid #999;"><div style="text-align:center;font-weight:700;border-bottom:1px solid #999;padding:1px 4px;">${d}</div><div style="height:16px;width:28px;"></div></div>`).join('')}
    </div>
    <div class="morse-ref" style="font-size:8pt;">${Object.entries(MORSE_TABLE).map(([k,v])=>`<div class="morse-e"><span class="morse-l">${k}</span><span>${v}</span></div>`).join('')}</div>
    <div class="ans-line"></div>`;
  } else if (p.type==='railfence') {
    inner=`<div class="q-type">Transposition &nbsp;|&nbsp; Rails: ${p.key}</div>
    <div class="ct-grp">${ct}</div><div class="ans-line"></div>`;
  } else if (p.type==='cryptarithm') {
    const lts=[...new Set(p.problem.equation.replace(/[^A-Z]/g,'').split(''))].sort();
    inner=`<div class="q-type">Mathematical &nbsp;|&nbsp; Each letter = unique digit 0–9</div>
    <div style="font-family:'Courier Prime',monospace;font-size:22pt;font-weight:700;letter-spacing:6px;text-align:center;padding:12px 0;">${p.problem.equation}</div>
    <div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:8px;">
      ${lts.map(l=>`<div style="border:1px solid #999;"><div style="text-align:center;font-weight:700;border-bottom:1px solid #999;padding:1px 6px;">${l}</div><div style="height:18px;width:22px;"></div></div>`).join('')}
    </div>`;
  }

  return `<div class="q-block">
    <div class="q-header">
      <span class="q-num">Q${num}. ${p.cipherMeta.name}</span>
      <span class="q-pts">[${p.cipherMeta.pts} points]</span>
    </div>
    ${inner}
  </div>`;
}

// =============================================
// INIT
// =============================================
window.addEventListener('DOMContentLoaded', () => {
  loadCipher('caesar');
});

// =============================================
// CIPHER META
// =============================================
function getCipherMetaCore(name) {
  const map = {
    caesar:          { name:'Caesar Cipher',          type:'Monoalphabetic',       pts:200, desc:'Shift cipher — every letter moved by a fixed amount. Find the shift and decode.' },
    atbash:          { name:'Atbash Cipher',           type:'Monoalphabetic',       pts:150, desc:'Reverse alphabet substitution. A↔Z, B↔Y, etc. Decode the cipher text.' },
    aristocrat:      { name:'Aristocrat',              type:'Monoalphabetic',       pts:200, desc:'Standard substitution cipher with word spaces preserved. No letter maps to itself.' },
    'aristocrat-mis':{ name:'Aristocrat (Misspelled)', type:'Monoalphabetic',       pts:300, desc:'Like an Aristocrat but words may be misspelled or homophones substituted.' },
    patristocrat:    { name:'Patristocrat',            type:'Monoalphabetic',       pts:250, desc:'Like an Aristocrat but all spaces removed. Letters grouped in sets of 5.' },
    affine:          { name:'Affine Cipher',           type:'Monoalphabetic Math',  pts:250, desc:'E(x) = (ax + b) mod 26. Keys a and b are given. Decode the cipher text.' },
    vigenere:        { name:'Vigenère Cipher',         type:'Polyalphabetic',       pts:300, desc:'Repeating keyword cipher. Each letter shifted by the corresponding key letter.' },
    porta:           { name:'Porta Cipher',            type:'Polyalphabetic',       pts:300, desc:'Predecessor to Vigenère with 13 row mappings. Self-reciprocal cipher.' },
    hill2:           { name:'Hill 2×2 Cipher',         type:'Polyalphabetic Math',  pts:250, desc:'Matrix multiplication cipher. Decrypt using the provided inverse matrix.' },
    hill3:           { name:'Hill 3×3 Cipher',         type:'Polyalphabetic Math',  pts:300, desc:'3×3 matrix multiplication cipher. Decryption matrix provided.' },
    baconian:        { name:'Baconian Cipher',         type:'Steganography',        pts:200, desc:'Each letter encoded as 5 A/B characters. Presented with various symbol systems.' },
    morbit:          { name:'Morbit Cipher',           type:'Tomogrammic',          pts:300, desc:'Morse code pairs encoded as single digits 1–9.' },
    pollux:          { name:'Pollux Cipher',           type:'Tomogrammic',          pts:300, desc:'Single Morse symbols encoded as digits 0–9. Multiple digits per symbol.' },
    railfence:       { name:'Rail Fence Cipher',       type:'Transposition',        pts:200, desc:'Letters written in zigzag pattern across N rails, then read row by row.' },
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
    'porta-analysis':{ name:'Porta Cryptanalysis',type:'Polyalphabetic (Crib)',  pts:350, desc:'Porta cipher with a plaintext crib of at least 3 characters given. Find the key and decode.' },
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
    case 'porta-analysis': {
      const q = getRandomFallbackQuote();
      const key = Porta.generateKey();
      const ct = Porta.encrypt(q, key);
      // crib: first word with 3+ chars
      const cribWord = q.split(' ').find(w=>w.replace(/[^A-Z]/gi,'').length>=3) || q.split(' ')[0];
      const cribClean = cribWord.replace(/[^A-Z]/gi,'');
      const ptNoSp = q.toUpperCase().replace(/[^A-Z]/g,'');
      const ctNoSp = ct.replace(/[^A-Z]/g,'');
      const cribIdx = ptNoSp.indexOf(cribClean.toUpperCase());
      const cribCT = cribIdx>=0 ? ctNoSp.slice(cribIdx,cribIdx+cribClean.length) : '???';
      currentProblem = { type:'porta-analysis', plaintext:q, ciphertext:ct, key,
        crib:cribClean, cribCT, cribIdx };
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
    case 'porta-analysis': renderPortaAnalysisUI(); break;
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
  const newTypes = ['xenocrypt','porta-analysis','frac-morse','nihilist','columnar','checkerboard'];
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
  } else if (p.type==='porta-analysis') {
    const inputs=[...document.querySelectorAll('.plain-input')];
    const pt=p.plaintext.toUpperCase().replace(/[^A-Z]/g,'').split('');
    let right=0;
    inputs.forEach((inp,i)=>{
      const val=inp.value.toUpperCase();
      inp.classList.remove('correct','incorrect');
      if(!val) return;
      val===pt[i]?(right++,inp.classList.add('correct')):inp.classList.add('incorrect');
    });
    correct=right===pt.length;
    msg=correct?'✓ CORRECT!':`◑ ${right}/${pt.length} (${Math.round(right/pt.length*100)}%)`;
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
  const newTypes = ['xenocrypt','porta-analysis','frac-morse','nihilist','columnar','checkerboard'];
  if (!newTypes.includes(p.type)) { showAnswerCore(); return; }
  stopTimer();

  let html = `<div class="key-reveal-block"><div class="key-reveal-label">Plaintext Solution</div><div class="solution-text">${(p.plaintext||'').toUpperCase()}</div></div>`;

  if (p.type==='xenocrypt') {
    html += `<div class="key-reveal-block"><div class="key-reveal-label">Alphabet Type</div><div class="key-reveal-value">${(p.keyType||'').toUpperCase()}</div></div>`;
    if(p.keyword) html+=`<div class="key-reveal-block"><div class="key-reveal-label">Keyword</div><div class="key-reveal-value">${p.keyword}</div></div>`;
  } else if (p.type==='porta-analysis') {
    html+=`<div class="key-reveal-block"><div class="key-reveal-label">Key</div><div class="key-reveal-value">${p.key}</div></div>`;
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

  const types = ['caesar','aristocrat','patristocrat','xenocrypt','vigenere','porta','hill2','affine','baconian','morbit','nihilist','checkerboard','railfence','cryptarithm'];
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