// Version 2.0.0

const prnt = console.log;
function ID(o) {
  return document.getElementById(o);
}


// Data file offsets
const VERSION_OFFSET = 4;
const CHAR_TYPE_OFFSET = 40;
const LEVEL_OFFSET = 43;
const STATS_OFFSET = 0x2fd;

// from 0 to 99
const EXPERIENCE_BY_LEVEL = [
  0, 500, 1500, 3750, 7875, 14175, 22680, 32886, 44396, 57715,
  72144, 90180, 112725, 140906, 176132, 220165, 275207, 344008, 430010, 537513,
  671891, 839864, 1049830, 1312287, 1640359, 2050449, 2563061, 3203826, 3902260, 4663553,
  5493363, 6397855, 7383752, 8458379, 9629723, 10906488, 12298162, 13815086, 15468534, 17270791,
  19235252, 21376515, 23710491, 26254525, 29027522, 32050088, 35344686, 38935798, 42850109, 47116709,
  51767302, 56836449, 62361819, 68384473, 74949165, 82104680, 89904191, 98405658, 107672256, 117772849,
  128782495, 140783010, 153863570, 168121381, 183662396, 200602101, 219066380, 239192444, 261129853, 285041630,
  311105466, 339515048, 370481492, 404234916, 441026148, 481128591, 524840254, 572485967, 624419793, 681027665,
  742730244, 809986056, 883294891, 963201521, 1050299747, 1145236814, 1248718217, 1361512946, 1484459201, 1618470619,
  1764543065, 1923762030, 2097310703, 2286478756, 2492671933, 2717422497, 2962400612, 3229426756, 3520485254
]

const CHAR_TYPE_LIST = ['ama', 'sor', 'nec', 'pal', 'bar', 'dru', 'ass']

// Character values
ATTRIB_AMAZON_L33 = {
  // "stashedGold": 0,
  // "gold": 0,
  "experience": EXPERIENCE_BY_LEVEL[32], // 7383752
  "level": 33,
  "maxStamina": 116,
  "currentStamina": 116,
  "maxMana": 63,
  "currentMana": 63,
  "maxHP": 114,
  "currentHP": 114,
  "unusedSkills": 32,
  "unusedStats": 160,
  "vitality": 20,
  "dexterity": 25,
  "energy": 15,
  "strength": 20
}

ATTRIB_ASSASSIN_L33 = {
  // "stashedGold": 0,
  // "gold": 0,
  "experience": EXPERIENCE_BY_LEVEL[32], // 7383752
  "level": 33,
  "maxStamina": 135,
  "currentStamina": 135,
  "maxMana": 73,
  "currentMana": 73,
  "maxHP": 114,
  "currentHP": 114,
  "unusedSkills": 32,
  "unusedStats": 160,
  "vitality": 20,
  "dexterity": 20,
  "energy": 25,
  "strength": 20
}

ATTRIB_NECRO_L33 = {
  // "stashedGold": 0,
  // "gold": 0,
  "experience": EXPERIENCE_BY_LEVEL[32], // 7383752
  "level": 33,
  "maxStamina": 111,
  "currentStamina": 111,
  "maxMana": 89,
  "currentMana": 89,
  "maxHP": 93,
  "currentHP": 93,
  "unusedSkills": 32,
  "unusedStats": 160,
  "vitality": 15,
  "dexterity": 25,
  "energy": 25,
  "strength": 15
}

ATTRIB_BARB_L33 = {
  // "stashedGold": 0,
  // "gold": 0,
  "experience": EXPERIENCE_BY_LEVEL[32], // 7383752
  "level": 33,
  "maxStamina": 124,
  "currentStamina": 124,
  "maxMana": 42,
  "currentMana": 42,
  "maxHP": 119,
  "currentHP": 119,
  "unusedSkills": 32,
  "unusedStats": 160,
  "vitality": 25,
  "dexterity": 20,
  "energy": 10,
  "strength": 30
}

ATTRIB_PALADIN_L33 = {
  // "stashedGold": 0,
  // "gold": 0,
  "experience": EXPERIENCE_BY_LEVEL[32], // 7383752
  "level": 33,
  "maxStamina": 121,
  "currentStamina": 121,
  "maxMana": 63,
  "currentMana": 63,
  "maxHP": 119,
  "currentHP": 119,
  "unusedSkills": 32,
  "unusedStats": 160,
  "vitality": 25,
  "dexterity": 20,
  "energy": 15,
  "strength": 25
}

ATTRIB_SORC_L33 = {
  // "stashedGold": 0,
  // "gold": 0,
  "experience": EXPERIENCE_BY_LEVEL[32], // 7383752
  "level": 33,
  "maxStamina": 106,
  "currentStamina": 106,
  "maxMana": 99,
  "currentMana": 99,
  "maxHP": 72,
  "currentHP": 72,
  "unusedSkills": 32,
  "unusedStats": 160,
  "vitality": 10,
  "dexterity": 25,
  "energy": 35,
  "strength": 10
}

ATTRIB_DRUID_L33 = {
  // "stashedGold": 0,
  // "gold": 0,
  "experience": EXPERIENCE_BY_LEVEL[32], // 7383752
  "level": 33,
  "maxStamina": 116,
  "currentStamina": 116,
  "maxMana": 84,
  "currentMana": 84,
  "maxHP": 103,
  "currentHP": 103,
  "unusedSkills": 32,
  "unusedStats": 160,
  "vitality": 25,
  "dexterity": 20,
  "energy": 20,
  "strength": 15
}

const FILE_VERSIONS = {
  'v71': '1.00 - 1.06',
  'v87': '1.07 or 1.08 exp',
  'v89': '1.08 std',
  'v92': '1.09',
  'v96': '1.10+',
  'v98': 'Resurrected',
}

function scaleAttributes(displayValues, down) {
  const multiplier = down ? 1 / 256 : 256;
  const tmp = displayValues
  // Health
  if (displayValues.maxHP) tmp.maxHP = displayValues.maxHP * multiplier
  if (displayValues.currentHP) tmp.currentHP = displayValues.currentHP * multiplier
  // Mana
  if (displayValues.maxMana) tmp.maxMana = displayValues.maxMana * multiplier
  if (displayValues.currentMana) tmp.currentMana = displayValues.currentMana * multiplier
  // Stamina
  if (displayValues.maxStamina) tmp.maxStamina = displayValues.maxStamina * multiplier
  if (displayValues.currentStamina) tmp.currentStamina = displayValues.currentStamina * multiplier

  return tmp
}

const TYPE_LVL33_ATTRIB = {
  ama: ATTRIB_AMAZON_L33,
  sor: ATTRIB_SORC_L33,
  nec: ATTRIB_NECRO_L33,
  pal: ATTRIB_PALADIN_L33,
  bar: ATTRIB_BARB_L33,
  dru: ATTRIB_DRUID_L33,
  ass: ATTRIB_ASSASSIN_L33
}

const ATTRIBUTES = [
  { id: 0, width: 10, name: 'strength', },
  { id: 1, width: 10, name: 'energy', },
  { id: 2, width: 10, name: 'dexterity', },
  { id: 3, width: 10, name: 'vitality', },
  { id: 4, width: 10, name: 'unusedStats', },
  { id: 5, width: 8, name: 'unusedSkills', },
  { id: 6, width: 21, name: 'currentHP', },
  { id: 7, width: 21, name: 'maxHP', },
  { id: 8, width: 21, name: 'currentMana', },
  { id: 9, width: 21, name: 'maxMana', },
  { id: 10, width: 21, name: 'currentStamina', },
  { id: 11, width: 21, name: 'maxStamina', },
  { id: 12, width: 7, name: 'level', },
  { id: 13, width: 32, name: 'experience', },
  { id: 14, width: 25, name: 'gold', },
  { id: 15, width: 25, name: 'stashedGold', },
]
// map attribute names to ids
const ATTRIBUTE_IDS = {}
for (var i = ATTRIBUTES.length; i--;) ATTRIBUTE_IDS[ATTRIBUTES[i].name] = ATTRIBUTES[i].id;
// prnt(ATTRIBUTE_IDS)

const DragDrop = {
  checkSupport: function () {
    // prettier-ignore
    return (window.File && window.FileReader && window.FileList && window.Blob)
  },

  // prettier-ignore
  add: function (divID, process) {
    const dropZone = ID(divID);
    const currentClass = dropZone.className
    if (currentClass.indexOf('droptarget') < 0) dropZone.className = currentClass + ' droptarget'
    dropZone.addEventListener("dragenter", DragDrop.onDragEnterLeave, false);
    dropZone.addEventListener("dragleave", DragDrop.onDragEnterLeave, false);
    dropZone.addEventListener("dragover", DragDrop.onDragOver, false);
    dropZone.addEventListener("drop", function (evt) { DragDrop.onDrop(evt, process) }, false);
  },
  readFileAndProcess: function (file, count, total, process) {
    const fr = new FileReader();
    fr.onload = function () {
      if (fr.result && typeof process === "function") {
        process(fr.result, file, count, total);
      }
    };
    fr.readAsArrayBuffer(file);
  },
  // prettier-ignore
  onDrop: function (evt, process) {
    evt.stopPropagation();
    evt.preventDefault();

    const files = evt.dataTransfer.files;
    if (files.length > 1) {
      alert('Can only process one file at a time')
      return
    }
    var output = [];
    for (var i = 0, f; (f = files[i]); i++) {
      DragDrop.readFileAndProcess(f, i + 1, files.length, process);
    }
    evt.target.className = evt.target.className.replace("dragover", "").trim();
  },
  // prettier-ignore
  onDragEnterLeave: function (evt) {
    const currentClass = evt.target.className;

    if (evt.type === "dragleave") {
      evt.target.className = currentClass.replace("dragover", "").trim();
    } else if (evt.type === "dragenter" && currentClass.indexOf("dragover") < 0) {
      evt.target.className = (currentClass + " dragover").trim();
    }
  },
  onDragOver: function (evt) {
    evt.preventDefault();
    evt.dataTransfer.dropEffect = "copy";
  }
};

function saveFileString(filename, data) {
  var blob = new Blob([data], { type: "data:application/octet-stream" });
  if (window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveBlob(blob, filename);
  } else {
    var elem = window.document.createElement("a");
    elem.href = window.URL.createObjectURL(blob);
    elem.download = filename;
    document.body.appendChild(elem);
    elem.click();
    document.body.removeChild(elem);
    window.URL.revokeObjectURL(elem.href);
  }
}

const D2CharEdit = {
  readString: function (buf, index, length) {
    return String.fromCharCode.apply(null, buf.slice(index, index + length))
  },
  isCharacterFile: function (buf) {
    if (buf.length < 1024) return false;

    // check headers
    const fileHeader = this.readString(buf, 0, 4);
    const questHeader = this.readString(buf, 335, 4);
    const waypointsHeader = this.readString(buf, 633, 2);

    return (
      fileHeader === "\x55\xaa\x55\xaa" &&
      questHeader === "Woo!" &&
      waypointsHeader === "WS"
    );
  },

  readByte: function (buf, index) {
    return buf[index];
  },

  writeByte: function (buf, index, value) {
    buf[index] = value & 0xff;
  },

  writeWORD: function (buf, index, word) {
    const lowerByte = word & 0xff;
    const upperByte = word >> 8;
    buf[index] = lowerByte;
    buf[index + 1] = upperByte;
  },

  writeDWORD: function (buf, index, word) {
    D2CharEdit.writeWORD(buf, index, word & 0xffff);
    D2CharEdit.writeWORD(buf, index + 2, word >> 16);
  },

  writeString: function (buf, index, str) {
    for (var i = 0; i < str.length; i++) {
      buf[index + i] = str.charCodeAt(i);
    }
  },

  calculateCheckSum: function (buf) {
    var n1 = bigInt(1);
    var n0 = bigInt(0);
    var n0x80000000 = bigInt("80000000", 16);
    var uiCS = n0;

    for (var i = 0; i < buf.length; i++) {
      const byte = i == 0xc || i == 0xd || i == 0xe || i == 0xf ? 0 : buf[i];
      uiCS = uiCS
        .shiftLeft(n1)
        .add(bigInt(byte))
        .add(uiCS.and(n0x80000000).notEquals(n0) ? n1 : n0);
    }

    return uiCS.and(bigInt(0xffffffff));
  },

  writeCheckSum: function (buf, value) {
    D2CharEdit.writeDWORD(buf, 0xc, value);
  },

  updateQuestData: function (buf, level) {
    if (level === "nightmare") {
      const questData =
        "\x9f\x01\x00\x01\x00\xfd\x9f\xfd\x9f\xfd\x9f\x01\x00\x00\x00\x00\x00\x00\x00\x01\x00\x00\x00\x00\x00\xfd\x9f\xfd\x9f\xfd\x9f\xfd\x9f\xfd\x9f\xfd\x9f\x01\x80\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x01\x00\xfd\x9f\xfd\x9f\xfd\x9f\xfd\x9f\xfd\x9f\xfd\x9f\x01\x00\x01\x00\x1d\x90\x79\x1c\xfd\x9f\xfd\x9f\xfd\x9f\xe5\x1f\x01\x00\x01\x00\xfd\x9f\xfd\x9f\xfd\x9f\xfd\x9f\xfd\x9f\xfd\x9f\x01\x00\x01\x00\xfd\x9f\xfd\x9f\xfd\x9f\x01\x00\x00\x00\x00\x00\x00\x00\x01\x00\x00\x00\x00\x00\xfd\x9f\xfd\x9f\xfd\x9f\xfd\x9f\xfd\x9f\xfd\x9f\x01\x80";
      D2CharEdit.writeString(buf, 0x186, questData);
    } else {
      const questData =
        "\x57\x6f\x6f\x21\x06\x00\x00\x00\x2a\x01\x01\x00\xfd\x9f\xfd\x9f\xfd\x9f\xfd\x9f\xfd\x9f\xfd\x9f\x01\x00\x01\x00\x1d\x90\x79\x1c\xfd\x9f\xfd\x9f\xfd\x9f\xe5\x1f\x01\x00\x01\x00\xfd\x9f\xfd\x9f\xfd\x9f\xfd\x9f\xfd\x9f\xfd\x97\x01\x00\x01\x00\xfd\x9f\xfd\x9f\xfd\x9f\x01\x00\x00\x00\x00\x00\x00\x00\x01\x00\x00\x00\x00\x00\xfd\x9f\xed\x9f\xfd\x9f\xfd\x9f\xfd\x9f\xfd\x9f\x01\x80\x00\x00\x00\x00\x00\x00";
      D2CharEdit.writeString(buf, 0x14f, questData);
    }
  },

  activateWayPoints: function (buf, level) {
    var offset = 0x283 // normal mode offset
    if (level === "nightmare") offset = 0x29B
    D2CharEdit.writeString(buf, offset, "\xff\xff\xff\xff\x77");
  },

  getFileVersion: function (buf) {
    const b1 = this.readByte(buf, VERSION_OFFSET);
    return `${b1} ${FILE_VERSIONS['v' + b1]}`;
  },

  // get the character type as a string
  getCharType: function (buf) {
    const charType = this.readByte(buf, CHAR_TYPE_OFFSET);
    return CHAR_TYPE_LIST[charType];
  },

  getHeaderLevel: function (buf) {
    return this.readByte(buf, LEVEL_OFFSET);
  },

  setHeaderLevel: function (buf, newLevel) {
    this.writeByte(buf, LEVEL_OFFSET, newLevel)
  },

  to8Bits: function (number) {
    const bits = "00000000".concat(number.toString(2)).slice(-8);
    return bits.split('').reverse().join('');

  },

  // Read reversed bits
  readRVBits: function (buf, offset, start, length, show) {
    const bytesToRead = Math.ceil(length / 8);
    const startBytes = Math.floor(start / 8);

    const arrayOfBytes = buf.slice(offset, offset + startBytes + bytesToRead);
    var bits = '';
    for (var i = 0; i < arrayOfBytes.length; i++) {
      const newBits = this.to8Bits(arrayOfBytes[i]);
      bits = bits.concat(newBits);
    }

    if (show) {
      return bits;
    };

    const requiredBits = bits.slice(start, start + length);
    const bitvalue = requiredBits.split('').reverse().join('');

    return parseInt(bitvalue, 2);
  },

  // Get current character statistics.  Return an object of values on success or string on error
  getStats: function (buf) {
    const attributes = {};
    const header = this.readString(buf, STATS_OFFSET, 2);
    const dof = STATS_OFFSET + 2; // Data Offset

    if (header !== 'gf') return "Error: invalid stats header";

    var bstart = 0;
    var aID = this.readRVBits(buf, dof, bstart, 9);
    bstart += 9;
    var value = 0;
    var attribLen = 0;

    while (aID !== 0x1ff) {
      attribLen = ATTRIBUTES[aID].width;
      value = this.readRVBits(buf, dof, bstart, attribLen);
      bstart += attribLen;

      attributes[ATTRIBUTES[aID].name] = value;
      // prnt(`>>>  Attrib: ${aID} ${ATTRIBUTES[aID].name}: Value: ${value}`)

      aID = this.readRVBits(buf, dof, bstart, 9);
      bstart += 9;
    }

    // GLOBAL_BITS = this.readRVBits(buf, dof, bstart - 9, 9, true);

    return attributes;
  },

  // return a reversed bit string with specified width of the given value
  rvBits: function (value, width) {
    const valueBinary = '0'.repeat(width).concat(value.toString(2)).slice(-width)
    return valueBinary.split('').reverse().join('')
  },

  setStats: function (buf, currentValues, newValues) {
    var bitData = ''

    // loop through each value and build stats data bit string
    for (var aName of Object.keys(currentValues)) {
      const id = ATTRIBUTE_IDS[aName]
      bitData = bitData.concat(this.rvBits(id, 9))

      const value = (newValues && typeof (newValues[aName]) === 'number') ? newValues[aName] : currentValues[aName]
      bitData = bitData.concat(this.rvBits(value, ATTRIBUTES[id].width))
    }

    bitData = bitData.concat(this.rvBits(0x1ff, 9))

    const dof = STATS_OFFSET + 2; // Data Offset
    const dataBytes = Math.floor(bitData.length / 8)
    var remainingBits = bitData
    for (var i = 0; i < dataBytes; i++) {
      buf[dof + i] = parseInt(remainingBits.slice(0, 8).split('').reverse().join(''), 2)
      remainingBits = remainingBits.slice(8)
    }
  },

  setLevel33: function (buf) {
    var attribOrError = D2CharEdit.getStats(buf);
    if (typeof (attribOrError) !== 'object') return prnt(attribOrError);
    const characterAttributes = attribOrError

    const charType = D2CharEdit.getCharType(buf);
    const newAttributes = TYPE_LVL33_ATTRIB[charType]

    this.setStats(buf, characterAttributes, scaleAttributes(newAttributes));
    this.setHeaderLevel(buf, 33);
  },

  makeMillionaire: function (buf) {
    var attribOrError = D2CharEdit.getStats(buf);
    if (typeof (attribOrError) !== 'object') return prnt(attribOrError);
    const characterAttributes = attribOrError

    const newAttributes = { stashedGold: 1000000, gold: 300000 }

    this.setStats(buf, characterAttributes, scaleAttributes(newAttributes));
  },

  showStats: function(buf) {
    var attribOrError = D2CharEdit.getStats(buf);
    if (typeof (attribOrError) !== 'object') return prnt(attribOrError);
    const characterAttributes = attribOrError

    prnt( scaleAttributes(characterAttributes) )
  }
};


function processFile(buf, file, count, total) {
  const fileUI8 = new Uint8Array(buf);

  if (D2CharEdit.isCharacterFile(fileUI8)) {
    const fileVersion = D2CharEdit.getFileVersion(fileUI8);
    prnt('File version: ' + fileVersion);

    const charType = D2CharEdit.getCharType(fileUI8);
    prnt(`Character type: ${charType}`);

    prnt('Old character stats')
    D2CharEdit.showStats(fileUI8)

    D2CharEdit.updateQuestData(fileUI8);
    D2CharEdit.activateWayPoints(fileUI8);

    if (ID('enrich').checked) {
      D2CharEdit.makeMillionaire(fileUI8)
    }

    if (ID('enable_level33').checked) {
      D2CharEdit.setLevel33(fileUI8)
    }

    prnt('New character stats')
    D2CharEdit.showStats(fileUI8)

    if (ID('mode_nightmare').checked) {
      D2CharEdit.updateQuestData(fileUI8, "nightmare");
      D2CharEdit.activateWayPoints(fileUI8, "nightmare");
    };

    const checksum = D2CharEdit.calculateCheckSum(fileUI8);
    D2CharEdit.writeCheckSum(fileUI8, checksum);
    saveFileString(file.name, fileUI8);
  } else {
    alert("This file is not a Diablo 2 character file that I can handle");
  }
}

if (DragDrop.checkSupport()) {
  DragDrop.add("dropzone1", processFile);
} else {
  alert("The File APIs are not fully supported in this browser.");
}

prnt("Ready!");
