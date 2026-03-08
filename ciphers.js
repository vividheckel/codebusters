// =============================================
// CODEBUSTERS CIPHER ENGINE
// =============================================

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

// =============================================
// UTILITY
// =============================================
function mod(n, m) { return ((n % m) + m) % m; }

function charToNum(c) { return c.toUpperCase().charCodeAt(0) - 65; }
function numToChar(n) { return ALPHABET[mod(n, 26)]; }

function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function letterFreq(text) {
  const freq = {};
  for (const c of text.toUpperCase()) {
    if (c >= 'A' && c <= 'Z') freq[c] = (freq[c] || 0) + 1;
  }
  return freq;
}

function cleanText(text) {
  return text.toUpperCase().replace(/[^A-Z ]/g, ' ').replace(/\s+/g, ' ').trim();
}

// =============================================
// CAESAR
// =============================================
const Caesar = {
  name: 'Caesar',
  type: 'Monoalphabetic',
  description: 'Simple letter shift cipher. Each letter is shifted by a fixed amount.',

  generateKey() {
    return randInt(1, 25);
  },

  encrypt(text, shift) {
    return text.toUpperCase().split('').map(c => {
      if (c >= 'A' && c <= 'Z') return numToChar(charToNum(c) + shift);
      return c;
    }).join('');
  },

  decrypt(text, shift) {
    return this.encrypt(text, -shift);
  }
};

// =============================================
// ATBASH
// =============================================
const Atbash = {
  name: 'Atbash',
  type: 'Monoalphabetic',
  description: 'Reverses the alphabet — A↔Z, B↔Y, etc.',

  encrypt(text) {
    return text.toUpperCase().split('').map(c => {
      if (c >= 'A' && c <= 'Z') return numToChar(25 - charToNum(c));
      return c;
    }).join('');
  },

  decrypt(text) { return this.encrypt(text); }
};

// =============================================
// ARISTOCRAT
// =============================================
const Aristocrat = {
  name: 'Aristocrat',
  type: 'Monoalphabetic',
  description: 'Standard substitution cipher — no letter maps to itself.',

  // Shared keyword pool for K1/K2 generation
  KEYWORDS: [
    'ABLE','ACID','ARCH','ARMY','ARTS','AXLE','BAKE','BANE','BARK','BEAR','BELL','BELT',
    'BEST','BILE','BIND','BITE','BLUR','BOLD','BOLT','BONE','BREW','BUCK','BUFF','BULK',
    'BURN','CAGE','CALM','CAPE','CAVE','CHIP','CITE','CLAN','CLAW','CLAY','CLUE','COAL',
    'COIL','CORE','COUP','COVE','CRAM','CREW','CROP','CURL','DARE','DARK','DART','DASH',
    'DAWN','DEAR','DEER','DEFT','DENY','DIAL','DICE','DIET','DOCK','DOME','DOVE','DRAG',
    'DRAW','DRIP','DROP','DRUM','DUNE','EARL','EARN','EDGE','EMIT','ENVY','EPIC','FADE',
    'FAIL','FAIR','FAME','FATE','FEAT','FELT','FILE','FIND','FIRE','FIRM','FIST','FLAG',
    'FLAT','FLEX','FLIP','FLOW','FOAM','FOLD','FOND','FORE','FORK','FORM','FOWL','FUME',
    'FUND','FUSE','GAME','GAZE','GEAR','GERM','GIVE','GLEE','GLOW','GOAL','GOAT','GOLD',
    'GOWN','GRAB','GRIN','GRIP','GULF','HACK','HAIL','HALT','HANG','HARD','HASH','HAWK',
    'HAZE','HEAP','HEAT','HEEL','HERB','HIGH','HIRE','HIVE','HOLD','HOLE','HOLY','HOME',
    'HOOK','HOPE','HORN','HOST','HUGE','HUMP','HUNT','HURL','HYMN','IDLE','IRIS','ISLE',
    'JAIL','JUMP','KEEN','KICK','KILL','KIND','KNIT','KNOB','LACE','LACK','LAKE','LAMB',
    'LAMP','LEAD','LEAN','LEAF','LEND','LENS','LIFT','LIKE','LIME','LINE','LINK','LION',
    'LIVE','LOAN','LOCK','LORE','LOVE','LUCK','LURE','LUSH','LUST','MADE','MAIL','MAIN',
    'MAKE','MALT','MARE','MARK','MAST','MAZE','MEAL','MEAN','MEAT','MELT','MESH','MILD',
    'MILL','MIND','MINE','MINT','MIST','MOAN','MOCK','MOLE','MONK','MOPE','MOSS','MOTH',
    'MOVE','MUCH','MULE','MUSE','MYTH','NAIL','NAME','NAVY','NEAT','NEED','NEST','NICE',
    'NORM','NOSE','OATS','OATH','OMEN','ONCE','ORCA','OVER','PAGE','PAIN','PALE','PALM',
    'PANG','PARK','PART','PASS','PATH','PAVE','PAWN','PEAK','PEAR','PEST','PICK','PILE',
    'PINE','PLAY','PLOT','PLUM','POEM','POKE','POND','PORE','POSE','PREY','PRIM','PUMP',
    'PURE','PUSH','RACK','RAGE','RAIL','RAIN','RAKE','RANT','RAFT','REAL','REIN','RELY',
    'REND','RICH','RIDE','RIFT','RING','RISK','RITE','ROAM','ROBE','ROCK','ROLE','ROOF',
    'ROPE','ROSE','RUIN','RULE','RUSH','RUST','SAGE','SAIL','SALT','SAND','SAVE','SEAL',
    'SEED','SILK','SINK','SLAM','SLAP','SLIM','SLIP','SLOW','SLUG','SNAP','SOCK','SOIL',
    'SOLE','SONG','SOOT','SORE','SOUL','SPAN','SPIN','SPIT','SPOT','SPUR','STAR','STAY',
    'STEM','STEP','STIR','STOP','SUIT','TALE','TALK','TALL','TAME','TANK','TARE','TASK',
    'TEAL','TENT','TERM','TIDE','TILE','TILL','TIRE','TOIL','TOLL','TOMB','TORN','TOUR',
    'TOWN','TRAM','TREE','TRIM','TRIO','TRIP','TUBE','TUCK','TUNE','TURN','UGLY','UNDO',
    'UNIT','VALE','VANE','VASE','VEIL','VEIN','VENT','VEST','VETO','VICE','VOID','VOLT',
    'VOTE','WADE','WAIL','WAKE','WALL','WAND','WANE','WARD','WARN','WARP','WASH','WAVE',
    'WEAL','WEEP','WELD','WELL','WEND','WICK','WIDE','WILE','WILL','WIND','WINE','WING',
    'WISE','WISP','WOOD','WORD','WORK','WORN','WRAP','WREN','YAWN','YEAR','YELL','ZEAL',
    'ZERO','ZINC','ZONE','ZOOM',
    // Longer keywords (5-9 letters) for richer alphabets
    'CIPHER','SECRET','DECODE','PUZZLE','SIGNAL','ENIGMA','VECTOR','SHADOW','BINARY',
    'PLANET','COMET','ORBIT','LASER','PRISM','GRAPH','LOGIC','AXIOM','PROOF','RATIO',
    'ANGLE','PRIME','DIGIT','RADIX','SIGMA','DELTA','OMEGA','GAMMA','ALPHA','THETA',
    'BEACON','CASTLE','DANCER','FALCON','GRAVEL','HUNTER','INSECT','JACKET','KERNEL',
    'LANCER','MORTAR','NAPKIN','OYSTER','PARROT','QUARTZ','RABBIT','SADDLE','TABLET',
    'WALNUT','FATHOM','COBALT','MAGNET','BRONZE','CHROME','HELIUM','RADIUM','NICKEL',
    'BARIUM','SULFUR','CARBON','NEON','ARGON','XENON','KRYPTON','IODINE','CESIUM',
    'LITHIUM','CALCIUM','SILICON','GALLIUM','ARSENIC','BROMINE','INDIUM','ANTIMONY',
    'BISCUIT','CABINET','DOLPHIN','ELBOW','FLANNEL','GOBLIN','HAMSTER','INKWELL',
    'JAVELIN','LANTERN','MONARCH','NOSTRIL','OBSCURE','PILGRIM','QUANTUM','RATCHET',
    'SATCHEL','TENDRIL','USURPER','VARNISH','WARLOCK','XYLOPHONE','YOGURT','ZEALOUS',
    'BLANKET','CATFISH','DARKROOM','EMBASSY','FOXHOUND','GATEWAY','HATBOX','ICEPACK',
    'JAWBONE','KEYSTONE','LAMPREY','MUSTANG','NETWORK','OUTLOOK','PADDOCK','RINGWORM',
    'SNOWPLOW','TURNPIKE','UPSWING','VANTAGE','WAYWARD','BOXCAR','CYCLONE','DUNGEON',
    'CRYSTAL','DYNAMO','FORMULA','HARMONY','IMPULSE','JOURNEY','KEYNOTE','LABYRINTH',
    'MANDATE','NETWORK','OBSCURE','PATTERN','QUARREL','RADIANT','SCIENCE','TRIUMPH',
    'UNIFORM','VENTURE','WARRIOR','COMPLEX','BRACKET','CLIMATE','CONTOUR','DIAGRAM'
  ],

  generateKey(keyType = 'random') {
    if (keyType === 'K1') return this.generateK1();
    if (keyType === 'K2') return this.generateK2();
    // Random derangement
    const key = {};
    const available = [...ALPHABET];
    for (const c of ALPHABET) {
      const filtered = available.filter(a => a !== c);
      if (filtered.length === 0) {
        const remaining = available[0];
        if (remaining !== c) {
          key[c] = remaining;
          available.splice(available.indexOf(remaining), 1);
        }
      } else {
        const pick = filtered[randInt(0, filtered.length - 1)];
        key[c] = pick;
        available.splice(available.indexOf(pick), 1);
      }
    }
    // Fix any remaining self-mappings by swapping
    const selfMapped = ALPHABET.split('').filter(c => key[c] === c);
    for (let i = 0; i < selfMapped.length - 1; i += 2) {
      const a = selfMapped[i], b = selfMapped[i + 1];
      [key[a], key[b]] = [key[b], key[a]];
    }
    if (selfMapped.length % 2 !== 0) {
      const last = selfMapped[selfMapped.length - 1];
      const other = ALPHABET.split('').find(c => c !== last && key[c] !== last);
      if (other) {
        const temp = key[last];
        key[last] = key[other];
        key[other] = temp;
      }
    }
    return key;
  },

  // K1: keyword appears in the CIPHER alphabet.
  // Plain:  A B C D E F ... Z   (standard order)
  // Cipher: [keyword unique chars + remaining letters, rotated by offset]
  // So the cipher row contains the keyword as a visible run.
  generateK1() {
    const kw = this.KEYWORDS[randInt(0, this.KEYWORDS.length - 1)];
    const kwUniq = [...new Set(kw.toUpperCase().split(''))];
    const used = new Set(kwUniq);
    const remainder = ALPHABET.split('').filter(c => !used.has(c));
    const cipherAlpha = [...kwUniq, ...remainder]; // 26 unique chars; keyword visible at start
    const offset = randInt(0, 25);
    const key = {};
    for (let i = 0; i < 26; i++) {
      key[ALPHABET[i]] = cipherAlpha[mod(i + offset, 26)];
    }
    // Fix self-mappings: swap with the next letter in cipher order
    for (let i = 0; i < 26; i++) {
      const c = ALPHABET[i];
      if (key[c] === c) {
        const j = mod(i + 1, 26);
        const d = ALPHABET[j];
        if (key[d] !== c && key[c] !== d) {
          [key[c], key[d]] = [key[d], key[c]];
        }
      }
    }
    return { key, keyword: kw, type: 'K1' };
  },

  // K2: keyword appears in the PLAIN alphabet.
  // Plain:  [keyword unique chars + remaining letters, rotated by offset]
  // Cipher: A B C D E F ... Z  (standard order — cipher is just the alphabet)
  // So looking at the substitution table row-by-row, the PLAIN side reveals the keyword.
  generateK2() {
    const kw = this.KEYWORDS[randInt(0, this.KEYWORDS.length - 1)];
    const kwUniq = [...new Set(kw.toUpperCase().split(''))];
    const used = new Set(kwUniq);
    const remainder = ALPHABET.split('').filter(c => !used.has(c));
    const plainAlpha = [...kwUniq, ...remainder]; // keyword visible in plaintext positions
    const offset = randInt(0, 25);
    const key = {};
    for (let i = 0; i < 26; i++) {
      // plainAlpha[i] encrypts to ALPHABET[(i+offset)%26]
      key[plainAlpha[i]] = ALPHABET[mod(i + offset, 26)];
    }
    // Fix self-mappings
    for (let i = 0; i < 26; i++) {
      const c = plainAlpha[i];
      if (key[c] === c) {
        const j = mod(i + 1, 26);
        const d = plainAlpha[j];
        if (key[d] !== c && key[c] !== d) {
          [key[c], key[d]] = [key[d], key[c]];
        }
      }
    }
    return { key, keyword: kw, type: 'K2' };
  },

  encrypt(text, key) {
    const k = key.key || key;
    return text.toUpperCase().split('').map(c => {
      if (c >= 'A' && c <= 'Z') return k[c] || c;
      return c;
    }).join('');
  },

  decrypt(cipherText, key) {
    const k = key.key || key;
    const reverse = {};
    for (const [plain, cipher] of Object.entries(k)) reverse[cipher] = plain;
    return cipherText.split('').map(c => {
      if (c >= 'A' && c <= 'Z') return reverse[c] || c;
      return c;
    }).join('');
  },

  getAlphabetRow(key) {
    const k = key.key || key;
    return ALPHABET.split('').map(c => k[c]);
  }
};

// =============================================
// PATRISTOCRAT (spaces removed, groups of 5)
// =============================================
const Patristocrat = {
  name: 'Patristocrat',
  type: 'Monoalphabetic',
  description: 'Like Aristocrat but spaces removed; letters grouped in 5s.',

  generateKey() { return Aristocrat.generateKey(); },
  encrypt(text, key) {
    const noSpaces = Aristocrat.encrypt(text.replace(/[^A-Z]/gi, ''), key);
    return noSpaces.match(/.{1,5}/g).join(' ');
  },
  decrypt(ct, key) { return Aristocrat.decrypt(ct.replace(/\s/g, ''), key); }
};

// =============================================
// AFFINE
// =============================================
const Affine = {
  name: 'Affine',
  type: 'Monoalphabetic Math',
  description: 'E(x) = (ax + b) mod 26. Keys: a must be coprime with 26.',
  VALID_A: [1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25],

  generateKey() {
    const a = this.VALID_A[randInt(1, this.VALID_A.length - 1)];
    const b = randInt(1, 25);
    return { a, b };
  },

  modInverse(a, m) {
    for (let i = 1; i < m; i++) if ((a * i) % m === 1) return i;
    return null;
  },

  encrypt(text, { a, b }) {
    return text.toUpperCase().split('').map(c => {
      if (c >= 'A' && c <= 'Z') return numToChar(mod(a * charToNum(c) + b, 26));
      return c;
    }).join('');
  },

  decrypt(text, { a, b }) {
    const aInv = this.modInverse(a, 26);
    return text.toUpperCase().split('').map(c => {
      if (c >= 'A' && c <= 'Z') return numToChar(mod(aInv * (charToNum(c) - b), 26));
      return c;
    }).join('');
  }
};

// =============================================
// VIGENERE
// =============================================
const Vigenere = {
  name: 'Vigenère',
  type: 'Polyalphabetic',
  description: 'Repeating keyword cipher — each letter shifted by corresponding key letter.',

  KEYWORDS: ['SCIENCE', 'CIPHER', 'OLYMPIAD', 'BREAKER', 'SIGNAL', 'VECTOR', 'ENIGMA', 'MATRIX', 'DECODE'],

  generateKey() {
    return this.KEYWORDS[randInt(0, this.KEYWORDS.length - 1)];
  },

  encrypt(text, key) {
    const k = key.toUpperCase();
    let ki = 0;
    return text.toUpperCase().split('').map(c => {
      if (c >= 'A' && c <= 'Z') {
        const enc = numToChar(charToNum(c) + charToNum(k[ki % k.length]));
        ki++;
        return enc;
      }
      return c;
    }).join('');
  },

  decrypt(text, key) {
    const k = key.toUpperCase();
    let ki = 0;
    return text.toUpperCase().split('').map(c => {
      if (c >= 'A' && c <= 'Z') {
        const dec = numToChar(charToNum(c) - charToNum(k[ki % k.length]));
        ki++;
        return dec;
      }
      return c;
    }).join('');
  }
};

// =============================================
// PORTA
// =============================================
const Porta = {
  name: 'Porta',
  type: 'Polyalphabetic',
  description: 'Predecessor to Vigenère with 13 possible row mappings.',

  TABLE: [
    'NOPQRSTUVWXYZ',
    'OPQRSTUVWXYZNIT',  // row 1 (C,D)
    'PQRSTUVWXYZNOC',
    'QRSTUVWXYZNOP',
    'RSTUVWXYZNOPR', // actually let's hardcode properly
  ],

  // ACA standard Porta table
  PORTA_TABLE: [
    { keys: 'AB', cipher: 'NOPQRSTUVWXYZ' },
    { keys: 'CD', cipher: 'OPQRSTUVWXYZN' },
    { keys: 'EF', cipher: 'PQRSTUVWXYZNOT' },
    { keys: 'GH', cipher: 'QRSTUVWXYZNOP' },
    { keys: 'IJ', cipher: 'RSTUVWXYZNOPQ' },
    { keys: 'KL', cipher: 'STUVWXYZNOPQR' },
    { keys: 'MN', cipher: 'TUVWXYZNOPQRS' },
    { keys: 'OP', cipher: 'UVWXYZNOPQRST' },
    { keys: 'QR', cipher: 'VWXYZNOPQRSTU' },
    { keys: 'ST', cipher: 'WXYZNOPQRSTUV' },
    { keys: 'UV', cipher: 'XYZNOPQRSTUVW' },
    { keys: 'WX', cipher: 'YZNOPQRSTUVWX' },
    { keys: 'YZ', cipher: 'ZNOPQRSTUVWXY' },
  ],

  KEYWORDS: ['PORTA', 'SIGNAL', 'CIPHER', 'BREAKER', 'VECTOR'], // TODO: generate keys

  generateKey() {
    return this.KEYWORDS[randInt(0, this.KEYWORDS.length - 1)];
  },

  getRow(keyChar) {
    const idx = Math.floor(charToNum(keyChar.toUpperCase()) / 2);
    return this.PORTA_TABLE[Math.min(idx, 12)];
  },

  encrypt(text, key) {
    const k = key.toUpperCase();
    let ki = 0;
    return text.toUpperCase().split('').map(c => {
      if (c >= 'A' && c <= 'Z') {
        const keyChar = k[ki % k.length];
        ki++;
        const row = this.getRow(keyChar);
        const n = charToNum(c);
        if (n < 13) {
          // A-M: use as column index, get cipher from row
          return row.cipher[n];
        } else {
          // N-Z: find position in cipher row
          const pos = row.cipher.indexOf(c);
          return pos >= 0 ? ALPHABET[pos] : c;
        }
      }
      return c;
    }).join('');
  },

  decrypt(text, key) {
    // Porta is self-reciprocal
    return this.encrypt(text, key);
  }
};

// =============================================
// HILL 2x2
// =============================================
const Hill2 = {
  name: 'Hill 2×2',
  type: 'Polyalphabetic Math',
  description: 'Matrix multiplication mod 26 with 2×2 key matrix.',

  VALID_KEYS: [
    { key: [[7,4],[11,15]],   inv: [[19,14],[19,21]], word: 'HELP' },
    { key: [[9,20],[12,15]],  inv: [[11,20],[12,17]], word: 'JUMP' },
    { key: [[1,4],[18,19]],   inv: [[7,4],[18,25]],   word: 'BEST' },
    { key: [[1,20],[17,13]],  inv: [[13,10],[15,19]], word: 'BURN' },
    { key: [[1,14],[11,3]],   inv: [[11,18],[3,21]],  word: 'BOLD' },
    { key: [[19,17],[0,15]],  inv: [[11,17],[0,7]],   word: 'TRAP' },
    { key: [[25,4],[0,11]],   inv: [[25,24],[0,19]],  word: 'ZEAL' },
    { key: [[1,4],[0,17]],    inv: [[1,12],[0,23]],   word: 'BEAR' },
    { key: [[1,4],[11,11]],   inv: [[17,8],[9,11]],   word: 'BELL' },
    { key: [[1,11],[20,17]],  inv: [[19,3],[22,21]],  word: 'BLUR' },
    { key: [[5,4],[17,13]],   inv: [[13,10],[23,7]],  word: 'FERN' },
    { key: [[9,4],[18,19]],   inv: [[17,6],[14,19]],  word: 'JEST' },
    { key: [[13,4],[17,3]],   inv: [[25,10],[23,13]], word: 'NERD' },
    { key: [[17,8],[5,19]],   inv: [[11,20],[19,3]],  word: 'RIFT' },
    { key: [[7,8],[13,19]],   inv: [[15,6],[13,11]],  word: 'HINT' },
    { key: [[9,14],[11,19]],  inv: [[21,16],[7,25]],  word: 'JOLT' },
    { key: [[17,4],[8,13]],   inv: [[13,18],[10,21]], word: 'REIN' },
    { key: [[21,14],[11,19]], inv: [[23,20],[25,9]],  word: 'VOLT' },
  ],

  MOD_INV_TABLE: { 1:1, 3:9, 5:21, 7:15, 9:3, 11:19, 15:7, 17:23, 19:11, 21:5, 23:17, 25:25 },

  generateKey() {
    return this.VALID_KEYS[randInt(0, this.VALID_KEYS.length - 1)];
  },

  matMul(mat, vec, m = 26) {
    return [
      mod(mat[0][0] * vec[0] + mat[0][1] * vec[1], m),
      mod(mat[1][0] * vec[0] + mat[1][1] * vec[1], m)
    ];
  },

  encrypt(text, keyObj) {
    const mat = keyObj.key;
    const letters = text.toUpperCase().replace(/[^A-Z]/g, '');
    const padded = letters.length % 2 !== 0 ? letters + 'Z' : letters;
    let result = '';
    for (let i = 0; i < padded.length; i += 2) {
      const vec = [charToNum(padded[i]), charToNum(padded[i + 1])];
      const out = this.matMul(mat, vec);
      result += numToChar(out[0]) + numToChar(out[1]);
    }
    return result;
  },

  getInverse(mat) {
    const det = mod(mat[0][0] * mat[1][1] - mat[0][1] * mat[1][0], 26);
    const detInv = this.MOD_INV_TABLE[det] || 1;
    return [
      [mod(detInv * mat[1][1], 26), mod(-detInv * mat[0][1], 26)],
      [mod(-detInv * mat[1][0], 26), mod(detInv * mat[0][0], 26)]
    ];
  },

  decrypt(text, keyObj) {
    const inv = keyObj.inv || this.getInverse(keyObj.key);
    const letters = text.toUpperCase().replace(/[^A-Z]/g, '');
    let result = '';
    for (let i = 0; i < letters.length; i += 2) {
      const vec = [charToNum(letters[i]), charToNum(letters[i + 1])];
      const out = this.matMul(inv, vec);
      result += numToChar(out[0]) + numToChar(out[1]);
    }
    return result;
  }
};

// =============================================
// HILL 3x3
// =============================================
const Hill3 = {
  name: 'Hill 3×3',
  type: 'Polyalphabetic Math',
  description: 'Matrix multiplication mod 26 with 3×3 key matrix. Decryption matrix provided.',

  VALID_KEYS: [
    {
      word: 'CAREFULLY',
      key: [[2,0,17],[4,5,20],[11,11,24]],
      inv: [[10,19,15],[24,23,18],[5,10,12]]
    },
    {
      word: 'HEARTBEAT',
      key: [[7,4,0],[17,19,1],[4,0,19]],
      inv: [[25,18,10],[15,1,15],[18,14,13]]
    },
    {
      word: 'LANDSCAPE',
      key: [[11,0,13],[3,18,2],[0,15,4]],
      inv: [[6,13,0],[2,10,21],[25,21,6]]
    },
    {
      word: 'STATEMENT',
      key: [[18,19,0],[19,4,12],[4,13,19]],
      inv: [[18,25,2],[9,16,20],[1,18,1]]
    },
    {
      word: 'TRANSLATE',
      key: [[19,17,0],[13,18,11],[0,19,4]],
      inv: [[11,14,7],[0,18,9],[13,25,3]]
    },
    {
      word: 'UNIVERSAL',
      key: [[20,13,8],[21,4,17],[18,0,11]],
      inv: [[14,13,17],[15,10,2],[22,0,3]]
    },
    {
      word: 'BLACKBIRD',
      key: [[1,11,0],[2,10,1],[8,17,3]],
      inv: [[13,5,7],[6,9,23],[18,5,16]]
    },
    {
      word: 'FACTORING',
      key: [[5,0,2],[19,14,17],[8,13,6]],
      inv: [[19,0,24],[22,14,5],[5,13,18]]
    },
    {
      word: 'LIMESTONE',
      key: [[11,8,12],[4,18,19],[14,13,4]],
      inv: [[23,10,20],[8,16,17],[4,17,18]]
    },
    {
      word: 'NATURALLY',
      key: [[13,0,19],[20,17,0],[11,11,24]],
      inv: [[6,9,5],[22,17,14],[11,13,13]]
    },
    {
      word: 'THUMBNAIL',
      key: [[19,7,20],[12,1,13],[0,8,11]],
      inv: [[7,15,5],[20,3,5],[2,12,13]]
    },
    {
      word: 'VALIDATES',
      key: [[21,0,11],[8,3,0],[19,4,18]],
      inv: [[2,18,19],[12,13,10],[1,20,11]]
    },
    {
      word: 'FAVORABLE',
      key: [[5,0,21],[14,17,0],[1,11,4]],
      inv: [[20,19,25],[8,15,10],[25,19,25]]
    },
  ],

  matMul3(mat, vec, m = 26) {
    return [
      mod(mat[0][0]*vec[0] + mat[0][1]*vec[1] + mat[0][2]*vec[2], m),
      mod(mat[1][0]*vec[0] + mat[1][1]*vec[1] + mat[1][2]*vec[2], m),
      mod(mat[2][0]*vec[0] + mat[2][1]*vec[1] + mat[2][2]*vec[2], m)
    ];
  },

  generateKey() {
    return this.VALID_KEYS[randInt(0, this.VALID_KEYS.length - 1)];
  },

  encrypt(text, keyObj) {
    const mat = keyObj.key;
    const letters = text.toUpperCase().replace(/[^A-Z]/g, '');
    const pad = (3 - (letters.length % 3)) % 3;
    const padded = letters + 'ZZ'.slice(0, pad);
    let result = '';
    for (let i = 0; i < padded.length; i += 3) {
      const vec = [charToNum(padded[i]), charToNum(padded[i+1]), charToNum(padded[i+2])];
      const out = this.matMul3(mat, vec);
      result += numToChar(out[0]) + numToChar(out[1]) + numToChar(out[2]);
    }
    return result;
  },

  decrypt(text, keyObj) {
    const inv = keyObj.inv;
    const letters = text.toUpperCase().replace(/[^A-Z]/g, '');
    let result = '';
    for (let i = 0; i < letters.length; i += 3) {
      const vec = [charToNum(letters[i]), charToNum(letters[i+1]), charToNum(letters[i+2])];
      const out = this.matMul3(inv, vec);
      result += numToChar(out[0]) + numToChar(out[1]) + numToChar(out[2]);
    }
    return result;
  }
};

// =============================================
// BACONIAN
// =============================================
const Baconian = { // TODO: implement the 3 types of baconian
  name: 'Baconian',
  type: 'Steganography',
  description: 'Each letter encoded as 5 A/B characters (24-letter form: I=J, U=V).',

  TABLE: {
    A:'AAAAA', B:'AAAAB', C:'AAABA', D:'AAABB', E:'AABAA', F:'AABAB', G:'AABBA', H:'AABBB',
    'I/J':'ABAAA', K:'ABAAB', L:'ABABA', M:'ABABB', N:'ABBAA', O:'ABBAB', P:'ABBBA', Q:'ABBBB',
    R:'BAAAA', S:'BAAAB', T:'BAABA', 'U/V':'BAABB', W:'BABAA', X:'BABAB', Y:'BABBA', Z:'BABBB'
  },

  buildEnc() {
    const enc = {};
    for (const [k, v] of Object.entries(this.TABLE)) {
      for (const c of k.split('/')) enc[c] = v;
    }
    return enc;
  },

  buildDec() {
    const dec = {};
    for (const [k, v] of Object.entries(this.TABLE)) dec[v] = k.split('/')[0];
    return dec;
  },

  encrypt(text) {
    const enc = this.buildEnc();
    return text.toUpperCase().split('').map(c => {
      if (enc[c]) return enc[c];
      return '';
    }).filter(Boolean).join(' ');
  },

  // Generate with symbols (bold/regular)
  encryptSymbol(text) {
    const enc = this.buildEnc();
    const groups = text.toUpperCase().split('').map(c => enc[c]).filter(Boolean);
    // Use ↑/↓ symbols
    return groups.join(' ');
  },

  decrypt(encoded) {
    const dec = this.buildDec();
    const groups = encoded.replace(/\s+/g, '').match(/.{5}/g) || [];
    return groups.map(g => dec[g] || '?').join('');
  }
};

// =============================================
// MORSE TABLE
// =============================================
const MORSE_TABLE = {
  A:'.-', B:'-...', C:'-.-.', D:'-..', E:'.', F:'..-.', G:'--.', H:'....', I:'..',
  J:'.---', K:'-.-', L:'.-..', M:'--', N:'-.', O:'---', P:'.--.',
  Q:'--.-', R:'.-.', S:'...', T:'-', U:'..-', V:'...-', W:'.--',
  X:'-..-', Y:'-.--', Z:'--..',
  '0':'-----','1':'.----','2':'..---','3':'...--','4':'....-',
  '5':'.....','6':'-....','7':'--...','8':'---..','9':'----.'
};

const MORSE_REVERSE = Object.fromEntries(Object.entries(MORSE_TABLE).map(([k,v])=>[v,k]));

function textToMorse(text) {
  return text.toUpperCase().split('').map(c => {
    if (c === ' ') return 'X';
    return MORSE_TABLE[c] ? MORSE_TABLE[c].replace(/\./g, '.').replace(/-/g, '-') : '';
  }).filter(Boolean).join('X');
}

function morseToText(morse) {
  return morse.split('XX').map(word =>
    word.split('X').map(letter => MORSE_REVERSE[letter] || '?').join('')
  ).join(' ');
}

// =============================================
// MORBIT
// =============================================
const Morbit = {
  name: 'Morbit',
  type: 'Tomogrammic',
  description: 'Morse code pairs encoded as single digits 1-9.',

  PAIRS: ['..', '.-', '.X', '-.', '--', '-X', 'X.', 'X-', 'XX'],

  generateKey() {
    const digits = shuffleArray(['1','2','3','4','5','6','7','8','9']);
    const key = {};
    this.PAIRS.forEach((pair, i) => { key[pair] = digits[i]; key[digits[i]] = pair; });
    return key;
  },

  encrypt(text, key) {
    const morse = textToMorse(text).replace(/\s/g, 'X');
    let out = '';
    for (let i = 0; i < morse.length; i += 2) {
      const pair = morse.slice(i, i + 2);
      if (pair.length < 2) break;
      out += (key[pair] || '?');
    }
    return out;
  },

  decrypt(text, key) {
    const morse = text.split('').map(d => key[d] || '??').join('');
    return morseToText(morse.replace(/X/g, ' '));
  }
};

// =============================================
// POLLUX
// =============================================
const Pollux = {
  name: 'Pollux',
  type: 'Tomogrammic',
  description: 'Like Morbit but single morse pieces; multiple digits can map to each symbol.',

  generateKey() {
    const digits = shuffleArray(['0','1','2','3','4','5','6','7','8','9']);
    const dots = [digits[0], digits[1], digits[2]];
    const dashes = [digits[3], digits[4], digits[5]];
    const spaces = [digits[6], digits[7], digits[8]];
    const key = {};
    digits.forEach(d => { key[d] = null; });
    dots.forEach(d => { key[d] = '.'; });
    dashes.forEach(d => { key[d] = '-'; });
    spaces.forEach(d => { key[d] = 'X'; });
    return { key, dots, dashes, spaces };
  },

  encrypt(text, keyObj) {
    const morse = textToMorse(text);
    let out = '';
    for (const c of morse) {
      const sym = c === 'X' ? 'X' : c;
      if (sym === 'X') out += keyObj.spaces[randInt(0, 2)];
      else if (sym === '.') out += keyObj.dots[randInt(0, 2)];
      else if (sym === '-') out += keyObj.dashes[randInt(0, 2)];
    }
    return out;
  },

  decrypt(text, keyObj) {
    const morse = text.split('').map(d => keyObj.key[d] || '?').join('');
    return morseToText(morse.replace(/X/g, ' '));
  }
};

// =============================================
// RAIL FENCE
// =============================================
const RailFence = {
  name: 'Rail Fence',
  type: 'Transposition',
  description: 'Letters are written in a zigzag pattern across N rails, then read row by row.',

  generateKey() { return randInt(2, 4); },

  encrypt(text, rails) {
    const clean = text.toUpperCase().replace(/[^A-Z]/g, '');
    const rows = Array.from({ length: rails }, () => []);
    let row = 0, dir = 1;
    for (const c of clean) {
      rows[row].push(c);
      if (row === 0) dir = 1;
      else if (row === rails - 1) dir = -1;
      row += dir;
    }
    return rows.map(r => r.join('')).join('');
  },

  decrypt(cipher, rails) {
    const n = cipher.length;
    const lens = Array(rails).fill(0);
    let row = 0, dir = 1;
    for (let i = 0; i < n; i++) {
      lens[row]++;
      if (row === 0) dir = 1;
      else if (row === rails - 1) dir = -1;
      row += dir;
    }
    const rows = [];
    let idx = 0;
    for (const len of lens) {
      rows.push(cipher.slice(idx, idx + len).split(''));
      idx += len;
    }
    const result = [];
    const rowIdx = Array(rails).fill(0);
    row = 0; dir = 1;
    for (let i = 0; i < n; i++) {
      result.push(rows[row][rowIdx[row]++]);
      if (row === 0) dir = 1;
      else if (row === rails - 1) dir = -1;
      row += dir;
    }
    return result.join('');
  },

  getGrid(text, rails) {
    const clean = text.toUpperCase().replace(/[^A-Z]/g, '');
    const grid = Array.from({ length: rails }, () => Array(clean.length).fill(null));
    let row = 0, dir = 1;
    for (let i = 0; i < clean.length; i++) {
      grid[row][i] = { char: clean[i], rail: row };
      if (row === 0) dir = 1;
      else if (row === rails - 1) dir = -1;
      row += dir;
    }
    return grid;
  }
};

// =============================================
// CRYPTARITHM
// =============================================
const Cryptarithm = {
  name: 'Cryptarithm',
  type: 'Mathematical',
  description: 'Mathematical equations where each letter represents a unique digit (0-9).',

  PROBLEMS: [
    { equation: 'SEND + MORE = MONEY', solution: { S:9,E:5,N:6,D:7,M:1,O:0,R:8,Y:2 } },
    { equation: 'BASE + BALL = GAMES', solution: { B:7,A:4,S:8,E:9,L:5,G:1,M:3,R:0 }, note:'Approx.' },
    { equation: 'TWO + TWO = FOUR', solution: { T:7,W:3,O:6,F:1,U:9,R:8 } },
    { equation: 'ODD + ODD = EVEN', solution: { O:6,D:5,E:1,V:7,N:0 } },
    { equation: 'FORTY + TEN + TEN = SIXTY', solution: { F:2,O:9,R:7,T:1,Y:8,E:5,N:0,S:6,I:4,X:3 } },
    { equation: 'BIG + CAT = LION', solution: null, note:'Multiple solutions' },
    { equation: 'COW + OAT = MEAL', solution: { C:5,O:7,W:1,A:9,T:4,M:6,E:8,L:0 }, note:'Approx.' },
  ], // TODO: generate more problems, ideally with unique solutions

  generateKey() {
    const idx = randInt(0, this.PROBLEMS.length - 1);
    return this.PROBLEMS[idx];
  }
};

// =============================================
// XENOCRYPT (Spanish Aristocrat)
// =============================================
const Xenocrypt = {
  name: 'Xenocrypt',
  type: 'Monoalphabetic (Spanish)',

  SPANISH_FALLBACK: [
    "LA CIENCIA ES LA ORGANIZACION DEL CONOCIMIENTO EN SISTEMAS EXPLICATIVOS E INTERPRETATIVOS DE LA EXPERIENCIA",
    "EL HOMBRE SABIO APRENDE MAS DE SUS ENEMIGOS QUE EL TONTO DE SUS AMIGOS",
    "LA LIBERTAD NO SE PIDE SE TOMA",
    "EL CONOCIMIENTO ES PODER Y EL PODER ES CONOCIMIENTO",
    "NO ES MAS RICO EL QUE MAS TIENE SINO EL QUE MENOS NECESITA",
    "LA VIDA ES CORTA Y EL ARTE ES LARGO",
    "EL QUE BUSCA LA VERDAD CORRE EL RIESGO DE ENCONTRARLA",
    "LA PACIENCIA ES LA MADRE DE LA CIENCIA",
    "MAS VALE TARDE QUE NUNCA PERO MAS VALE NUNCA TARDE",
    "LA INTELIGENCIA ES LA HABILIDAD DE ADAPTARSE A LOS CAMBIOS",
    "EL EXITO NO ES LA CLAVE DE LA FELICIDAD ES LA FELICIDAD LA CLAVE DEL EXITO",
    "APRENDER SIN PENSAR ES PERDER EL TIEMPO PENSAR SIN APRENDER ES PELIGROSO",
    "LA CIENCIA PROGRESA GRACIAS A LA DUDA Y LA CONFIANZA",
    "UN LIBRO ES UN JARDIN QUE CABE EN EL BOLSILLO",
    "EL CAMINO MAS LARGO EMPIEZA CON EL PRIMER PASO",
    "LA NATURALEZA ES EL ARTE DE DIOS",
    "CADA DIA SABEMOS MAS Y ENTENDEMOS MENOS",
    "LA EDUCACION ES EL ARMA MAS PODEROSA QUE PUEDES USAR PARA CAMBIAR EL MUNDO",
    "EL SECRETO DEL EXITO ES LA CONSTANCIA EN EL PROPOSITO",
    "NO TENGAS MIEDO DE RENUNCIAR A LO BUENO PARA IR A LO GRANDIOSO"
  ],

  async fetchQuote() {
    try {
      // Try using a CORS proxy to bypass CORS restrictions
      const resp = await fetch('https://api.allorigins.win/get?url=' + encodeURIComponent('https://quotes-api-three.vercel.app/api/randomquote?language=es'));
      if (!resp.ok) throw new Error('API failed');
      const data = await resp.json();
      const quotesData = JSON.parse(data.contents);
      const q = quotesData.quote || quotesData.text || quotesData.q;
      if (q && q.length > 20) {
        return q.toUpperCase().replace(/[^A-ZÁÉÍÓÚÜÑ ]/g, ' ').replace(/Á/g,'A').replace(/É/g,'E')
          .replace(/Í/g,'I').replace(/Ó/g,'O').replace(/Ú/g,'U').replace(/Ü/g,'U').replace(/Ñ/g,'N')
          .replace(/\s+/g,' ').trim();
      }
    } catch(e) {}
    return this.SPANISH_FALLBACK[randInt(0, this.SPANISH_FALLBACK.length - 1)];
  },

  generateKey() { return Aristocrat.generateKey(); }
};

// =============================================
// FRACTIONATED MORSE
// =============================================
const FractionatedMorse = {
  name: 'Fractionated Morse',
  type: 'Fractionated',

  KEYWORDS: ['ROUNDTABLE','SCIENCE','CIPHER','OLYMPIAD','BREAKER'],

  generateKey(keyType) {
    const kw = this.KEYWORDS[randInt(0, this.KEYWORDS.length - 1)];
    const used = new Set(kw.split(''));
    const remainder = ALPHABET.split('').filter(c => !used.has(c));
    const alpha = [...new Set(kw.split('')),...remainder];
    // Trigraph table: all combos of .,-,x in groups of 3, 27 combos map to 26 letters
    // Actually: 3^3=27, skip one or use first 26
    const syms = ['.', '-', 'X'];
    const trigraphs = [];
    for (const a of syms) for (const b of syms) for (const c of syms) {
      if (trigraphs.length < 26) trigraphs.push(a+b+c);
    }
    const encMap = {};
    const decMap = {};
    for (let i = 0; i < 26; i++) {
      encMap[trigraphs[i]] = alpha[i];
      decMap[alpha[i]] = trigraphs[i];
    }
    return { keyword: kw, alpha, encMap, decMap };
  },

  encrypt(text, keyObj) {
    // text → morse (. - X separators) padded to multiple of 3
    const letters = text.toUpperCase().replace(/[^A-Z ]/g,'');
    let morse = '';
    for (const c of letters) {
      if (c === ' ') { morse += 'X'; continue; }
      morse += MORSE_TABLE[c] + 'X';
    }
    // pad to multiple of 3 with X
    while (morse.length % 3 !== 0) morse += 'X';
    let result = '';
    for (let i = 0; i < morse.length; i += 3) {
      const tri = morse.slice(i, i+3);
      result += keyObj.encMap[tri] || '?';
    }
    return result;
  },

  decrypt(text, keyObj) {
    const morse = text.toUpperCase().split('').map(c => keyObj.decMap[c] || '???').join('');
    // split on X, X between letters within word, XX between words
    const parts = morse.split('X').filter(p => p.length > 0);
    let result = '';
    let prevWasEmpty = false;
    for (let i = 0; i < morse.length;) {
      // find next X
      const j = morse.indexOf('X', i);
      if (j === -1) { result += MORSE_REVERSE[morse.slice(i)] || '?'; break; }
      const chunk = morse.slice(i, j);
      if (chunk.length > 0) result += (MORSE_REVERSE[chunk] || '?');
      // double-X means word space
      if (morse[j+1] === 'X') { result += ' '; i = j+2; } else { i = j+1; }
    }
    return result;
  },

  // Build the trigraph alphabet table for display
  buildTable(keyObj) {
    const syms = ['.', '-', 'X'];
    const rows = [];
    for (const b of syms) {
      const cells = [];
      for (const c of syms) {
        for (const a of syms) {
          const tri = a+b+c;
          cells.push({ tri, letter: keyObj.encMap[tri] || '?' });
        }
      }
      rows.push(cells);
    }
    return rows;
  }
};

// =============================================
// NIHILIST CIPHER
// =============================================
const Nihilist = {
  name: 'Nihilist',
  type: 'Polyalphabetic Math',

  // Standard Polybius 5x5 (J merged with I)
  POLYBIUS_STD: ['ABCDE','FGHIK','LMNOP','QRSTU','VWXYZ'],

  buildPolybiusKey(keyword) {
    const kw = (keyword||'KEY').toUpperCase().replace(/J/g,'I');
    const used = new Set(kw.split(''));
    const remainder = 'ABCDEFGHIKLMNOPQRSTUVWXYZ'.split('').filter(c=>!used.has(c));
    const alpha = [...new Set(kw.split('')),...remainder].slice(0,25);
    const sq = [];
    for (let r=0;r<5;r++) sq.push(alpha.slice(r*5,r*5+5));
    const pos = {};
    for (let r=0;r<5;r++) for (let c=0;c<5;c++) pos[alpha[r*5+c]]={r:r+1,c:c+1};
    return {sq, pos, keyword};
  },

  charCode(c, pos) {
    const p = pos[c.toUpperCase().replace(/J/g,'I')];
    return p ? p.r*10+p.c : null;
  },

  KEYWORDS: ['KEY','CIPHER','MATRIX','ZERO','ANGLE','PRIME'],
  MSGKEYWORDS: ['SNOW','FIRE','MIST','TIDE','ROCK','STAR'],

  generateKey() {
    const sqKw = this.KEYWORDS[randInt(0,this.KEYWORDS.length-1)];
    const msgKw = this.MSGKEYWORDS[randInt(0,this.MSGKEYWORDS.length-1)];
    return { sqKw, msgKw };
  },

  encrypt(text, keyObj) {
    const sq = this.buildPolybiusKey(keyObj.sqKw);
    const msgKey = keyObj.msgKw;
    const clean = text.toUpperCase().replace(/[^A-Z]/g,'').replace(/J/g,'I');
    // encode message to polybius numbers
    const msgNums = clean.split('').map(c=>this.charCode(c, sq.pos)).filter(Boolean);
    // encode keyword to polybius numbers (repeating)
    const kwNums = msgKey.toUpperCase().replace(/J/g,'I').split('').map(c=>this.charCode(c, sq.pos)).filter(Boolean);
    // add pairs
    return msgNums.map((n,i) => n + kwNums[i % kwNums.length]).join(' ');
  },

  decrypt(cipher, keyObj) {
    const sq = this.buildPolybiusKey(keyObj.sqKw);
    const msgKey = keyObj.msgKw;
    const kwNums = msgKey.toUpperCase().replace(/J/g,'I').split('').map(c=>this.charCode(c, sq.pos)).filter(Boolean);
    const nums = cipher.trim().split(/\s+/).map(Number);
    return nums.map((n,i) => {
      const poly = n - kwNums[i % kwNums.length];
      const r = Math.floor(poly/10)-1;
      const c = (poly%10)-1;
      if (r<0||r>4||c<0||c>4) return '?';
      return sq.sq[r][c];
    }).join('');
  }
};

// =============================================
// CHECKERBOARD (Polybius Square)
// =============================================
const Checkerboard = {
  name: 'Checkerboard',
  type: 'Polybius Square',

  KEYWORDS: ['MACHINE','PLANETS','COASTER','TURBINES','WORKSHOP'],

  generateKey() {
    const kw = this.KEYWORDS[randInt(0,this.KEYWORDS.length-1)];
    const kwClean = kw.toUpperCase().replace(/J/g,'I');
    const used = new Set(kwClean.split(''));
    const remainder = 'ABCDEFGHIKLMNOPQRSTUVWXYZ'.split('').filter(c=>!used.has(c));
    const alpha = [...new Set(kwClean.split('')),...remainder].slice(0,25);
    const sq = [];
    for (let r=0;r<5;r++) sq.push(alpha.slice(r*5,r*5+5));
    const pos = {};
    for (let r=0;r<5;r++) for (let c=0;c<5;c++) pos[alpha[r*5+c]]={r,c};
    return {sq, pos, keyword:kw};
  },

  encrypt(text, keyObj) {
    const clean = text.toUpperCase().replace(/[^A-Z]/g,'').replace(/J/g,'I');
    return clean.split('').map(c => {
      const p = keyObj.pos[c];
      return p ? `${p.r+1}${p.c+1}` : '??';
    }).join(' ');
  },

  decrypt(cipher, keyObj) {
    return cipher.trim().split(/\s+/).map(pair => {
      const r = parseInt(pair[0])-1, c = parseInt(pair[1])-1;
      if (r<0||r>4||c<0||c>4) return '?';
      return keyObj.sq[r][c];
    }).join('');
  }
};

// =============================================
// COMPLETE COLUMNAR TRANSPOSITION
// =============================================
const CompleteColumnar = {
  name: 'Complete Columnar',
  type: 'Transposition',

  KEYWORDS: ['CRYPTO','SIGNAL','DECODE','MATRIX','VECTOR','BREAKER','HIDDEN'],

  generateKey() {
    const kw = this.KEYWORDS[randInt(0,this.KEYWORDS.length-1)];
    // Assign column order: rank letters alphabetically
    const order = kw.split('').map((c,i)=>({c,i,rank:0}));
    const sorted = [...order].sort((a,b)=>a.c<b.c?-1:a.c>b.c?1:a.i-b.i);
    sorted.forEach((s,rank) => { order[s.i].rank = rank+1; });
    const colOrder = order.map(o=>o.rank);
    return { keyword: kw, colOrder };
  },

  encrypt(text, keyObj) {
    const clean = text.toUpperCase().replace(/[^A-Z]/g,'');
    const n = keyObj.colOrder.length;
    // pad to multiple of n
    const padded = clean + 'X'.repeat((n - clean.length%n)%n);
    const rows = Math.ceil(padded.length/n);
    // build grid
    const grid = [];
    for (let r=0;r<rows;r++) grid.push(padded.slice(r*n,(r+1)*n).split(''));
    // read in column order (sorted by rank)
    const rankToCol = [];
    for (let rank=1;rank<=n;rank++) {
      const col = keyObj.colOrder.indexOf(rank);
      rankToCol.push(col);
    }
    return rankToCol.map(col => grid.map(row=>row[col]).join('')).join('');
  },

  decrypt(cipher, keyObj) {
    const n = keyObj.colOrder.length;
    const rows = Math.ceil(cipher.length/n);
    // each column has `rows` characters
    const rankToCol = [];
    for (let rank=1;rank<=n;rank++) rankToCol.push(keyObj.colOrder.indexOf(rank));
    // split cipher into columns in order
    const colData = [];
    let idx=0;
    for (let r=0;r<n;r++) {
      colData.push(cipher.slice(idx,idx+rows).split(''));
      idx+=rows;
    }
    // reconstruct: colData[i] is column rankToCol[i]
    const grid = Array.from({length:rows},()=>Array(n).fill(''));
    rankToCol.forEach((col,i)=>{ colData[i].forEach((c,r)=>{ grid[r][col]=c; }); });
    return grid.map(r=>r.join('')).join('').replace(/X+$/,'');
  }
};