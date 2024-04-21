const recognition = new webkitSpeechRecognition() || new SpeechRecognition();
recognition.interimResults = true;
recognition.continuous = true;
let index = 0;
let start1 = true;
let g = [];

function start() {
  document.getElementById("rawText").innerText += '\n---------- Recording Started. ----------'
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
    document.getElementById("rawText").textContent = '';

  }
  if (boxtype === "notesText") {
    console.log("notes");
    document.getElementById("notesText").textContent = '';
  }
}

recognition.onresult = event => {
    const result = event.results[event.results.length - 1];
    if(result.isFinal) {
      g.push(result[0].transcript);
      console.log(g);
      document.getElementById("rawText").innerText += "\n\n" + g[index].toString();
      index += 1;
    }
};

recognition.onend = () => {
  g = [];
  index = 0;
  document.getElementById("rawText").innerText += "\n\n" + '---------- Recording Stopped. ----------';
  console.log('finished')
};

recognition.onerror = event => {
    console.error('Speech recognition error:', event.error);
};

recognition.onnomatch = () => {
    console.log('No speech was recognized.');
};



