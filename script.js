const audioContext = new AudioContext();

const NOTE_DETAILS = [
  { note: "C", key: "Z", frequency: 261.626, active: false },
  { note: "Db", key: "S", frequency: 277.183, active: false },
  { note: "D", key: "X", frequency: 293.665, active: false },
  { note: "Eb", key: "D", frequency: 311.127, active: false },
  { note: "E", key: "C", frequency: 329.628, active: false },
  { note: "F", key: "V", frequency: 349.228, active: false },
  { note: "Gb", key: "G", frequency: 369.994, active: false },
  { note: "G", key: "B", frequency: 391.995, active: false },
  { note: "Ab", key: "H", frequency: 415.305, active: false },
  { note: "A", key: "N", frequency: 440, active: false },
  { note: "Bb", key: "J", frequency: 466.164, active: false },
  { note: "B", key: "M", frequency: 493.883, active: false },
];

// Piano keys added
const piano = document.getElementsByClassName("piano")[0];
NOTE_DETAILS.forEach((item, idx) => {
  const key = document.createElement("div");
  key.setAttribute("data-note", item.note);
  key.classList.add(["key"]);
  if (idx % 2) {
    key.classList.add("black");
    console.log("black class added");
  } else {
    key.classList.add(["white"]);
    console.log("white class added");
  }

  key.innerHTML = `<p>${item.key}</p>`;
  piano.appendChild(key);
});

document.addEventListener("keydown", (e) => {
  if (e.repeat) return;
  const keyBoardKey = e.code;
  const noteDetails = getNoteDetail(keyBoardKey);

  if (noteDetails == null) return;

  noteDetails.active = true;
  playNote();
});

document.addEventListener("keyup", (e) => {
  if (e.repeat) return;
  const keyBoardKey = e.code;
  const noteDetails = getNoteDetail(keyBoardKey);

  if (noteDetails == null) return;

  noteDetails.active = false;
  playNote();
});

function getNoteDetail(keyBoardKey) {
  return NOTE_DETAILS.find((n) => `Key${n.key}` === keyBoardKey);
}

function playNote() {
  NOTE_DETAILS.forEach((n) => {
    const keyElement = document.querySelector(`[data-note="${n.note}"]`);
    keyElement.classList.toggle("active", n.active);
    if (n.oscillator != null) {
      n.oscillator.stop();
      n.oscillator.disconnect();
    }
  });

  const activeNotes = NOTE_DETAILS.filter((n) => n.active);
  const gain = 1 / activeNotes.length;
  activeNotes.forEach((n) => {
    startNote(n, gain);
  });
}

function startNote(noteDetail, gain) {
  const gainNode = audioContext.createGain();
  gainNode.gain.value = gain;

  const oscillator = audioContext.createOscillator();
  oscillator.frequency.value = noteDetail.frequency;
  oscillator.type = "sine";
  oscillator.connect(gainNode).connect(audioContext.destination);
  oscillator.start();
  noteDetail.oscillator = oscillator;
}
