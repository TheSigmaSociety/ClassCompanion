const recognition = new webkitSpeechRecognition() || new SpeechRecognition();
recognition.interimResults = true;
recognition.continuous = true;
const rawText = document.getElementById("rawText");
const notesText = document.getElementById("notesText");
let index = 0;


let start1 = true;
g = [];
function start() {
  if(start1) { 
    recognition.start();
  }
  else {
    recognition.stop();
  }
  start1 = !start1;
}

function clearBox(boxtype) {
  if (boxtype === "rawText") {
    console.log("raw");
    rawText.innerHTML = '';
  }
  if (boxtype === "notesText") {
    console.log("notes");
    notesText.innerHTML = '';
  }
}

recognition.onresult = event => {
    const result = event.results[event.results.length - 1];
    if(result.isFinal) {
      g.push(result[0].transcript);
      console.log(g);
      rawText.innerHTML += `<br>` + g[index].toString();
      index += 1;
    }
};

recognition.onend = () => {
  g = [];
  index = 0;
  rawText.innerHTML += `<br>` + 'Recording Stopped.';
  console.log('finished')
};

recognition.onerror = event => {
    console.error('Speech recognition error:', event.error);
};

recognition.onnomatch = () => {
    console.log('No speech was recognized.');
};



