const recognition = new webkitSpeechRecognition() || new SpeechRecognition();
recognition.interimResults = true;
recognition.continuous = true;
const startButton = document.getElementById('startButton');
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

recognition.onresult = event => {
    const result = event.results[event.results.length - 1];
    if(result.isFinal) {
      g.push(result[0].transcript); 
      console.log(g);
    }
};

recognition.onend = () => {
  g = [];
  console.log('finished')
};

recognition.onerror = event => {
    console.error('Speech recognition error:', event.error);
};

recognition.onnomatch = () => {
    console.log('No speech was recognized.');
};



