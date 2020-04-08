const print = console.log;
function ID(o) {
  return document.getElementById(o);
}

const DragDrop = {
  checkSupport: function() {
    // prettier-ignore
    return (window.File && window.FileReader && window.FileList && window.Blob)
  },

  // prettier-ignore
  add: function(divID, process) {
    const dropZone = ID(divID);
    const currentClass = dropZone.className
    if (currentClass.indexOf('droptarget') < 0) dropZone.className = currentClass + ' droptarget'
    dropZone.addEventListener("dragenter", DragDrop.onDragEnterLeave, false);
    dropZone.addEventListener("dragleave", DragDrop.onDragEnterLeave, false);
    dropZone.addEventListener("dragover", DragDrop.onDragOver, false);
    dropZone.addEventListener("drop", function(evt) { DragDrop.onDrop(evt, process) }, false);
  },
  readFileAndProcess: function(file, count, total, process) {
    const fr = new FileReader();
    fr.onload = function() {
      if (fr.result && typeof process === "function") {
        process(fr.result, file, count, total);
      }
    };
    fr.readAsArrayBuffer(file);
  },
  // prettier-ignore
  onDrop: function(evt, process) {
    evt.stopPropagation();
    evt.preventDefault();

    const files = evt.dataTransfer.files;
    if (files.length > 1) {
      alert('Can only process one file at a time')
      return
    }
    var output = [];
    for (var i = 0, f; (f = files[i]); i++) {
      DragDrop.readFileAndProcess(f, i+1, files.length, process);
    }
    evt.target.className = evt.target.className.replace("dragover", "").trim();
  },
  // prettier-ignore
  onDragEnterLeave: function(evt) {
    const currentClass = evt.target.className;

    if (evt.type === "dragleave") {
      evt.target.className = currentClass.replace("dragover", "").trim();
    } else if (evt.type === "dragenter" && currentClass.indexOf("dragover") < 0) {
      evt.target.className = (currentClass + " dragover").trim();
    }
  },
  onDragOver: function(evt) {
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
  isCharacterFile: function(buf) {
    if (buf.length < 1024) return false;

    // check headers
    const fileHeader = String.fromCharCode.apply(null, buf.slice(0, 4));
    const questHeader = String.fromCharCode.apply(
      null,
      buf.slice(335, 335 + 4)
    );
    const waypointsHeader = String.fromCharCode.apply(
      null,
      buf.slice(633, 633 + 2)
    );
    return (
      fileHeader === "\x55\xaa\x55\xaa" &&
      questHeader === "Woo!" &&
      waypointsHeader === "WS"
    );
  },

  calculateCheckSum: function(buf) {
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

  writeWORD: function(buf, index, word) {
    const lowerByte = word & 0xff;
    const upperByte = word >> 8;
    buf[index] = lowerByte;
    buf[index + 1] = upperByte;
  },

  writeDWORD: function(buf, index, word) {
    D2CharEdit.writeWORD(buf, index, word & 0xffff);
    D2CharEdit.writeWORD(buf, index + 2, word >> 16);
  },

  writeString: function(buf, index, str) {
    for (var i = 0; i < str.length; i++) {
      buf[index + i] = str.charCodeAt(i);
    }
  },

  writeCheckSum: function(buf, value) {
    D2CharEdit.writeDWORD(buf, 0xc, value);
  },

  updateQuestData: function(buf) {
    const questData =
      "\x57\x6f\x6f\x21\x06\x00\x00\x00\x2a\x01\x01\x00\xfd\x9f\xfd\x9f\xfd\x9f\xfd\x9f\xfd\x9f\xfd\x9f\x01\x00\x01\x00\x1d\x90\x79\x1c\xfd\x9f\xfd\x9f\xfd\x9f\xe5\x1f\x01\x00\x01\x00\xfd\x9f\xfd\x9f\xfd\x9f\xfd\x9f\xfd\x9f\xfd\x97\x01\x00\x01\x00\xfd\x9f\xfd\x9f\xfd\x9f\x01\x00\x00\x00\x00\x00\x00\x00\x01\x00\x00\x00\x00\x00\xfd\x9f\xed\x9f\xfd\x9f\xfd\x9f\xfd\x9f\xfd\x9f\x01\x80\x00\x00\x00\x00\x00\x00";
      D2CharEdit.writeString(buf, 335, questData);
  },

  activateWayPoints: function(buf) {
    D2CharEdit.writeString(buf, 0x283, "\xff\xff\xff\xff\x77");
  }
};


function processFile(buf, file, count, total) {
  const fileUI8 = new Uint8Array(buf);

  if (D2CharEdit.isCharacterFile(fileUI8)) {
    D2CharEdit.updateQuestData(fileUI8);
    D2CharEdit.activateWayPoints(fileUI8);
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

print("Ready!");
