import OpenAI from 'openai';
import { OPENAI_API_KEY } from './key';

const recognition = new webkitSpeechRecognition() || new SpeechRecognition();
recognition.interimResults = true;
recognition.continuous = true;
let index = 0;
let start1 = true;
let g = [];

class Queue {

  constructor() {
    this.elements = [];
    this.openai = new OpenAI({ apiKey: OPENAI_API_KEY, dangerouslyAllowBrowser: true});
  }

  enqueue(x) {
    this.elements.push(x);
  }

  dequeue() {
    const element = this.elements[0];
    delete this.elements[this.frontIndex];
    return element;
  }

  getFrontElement() {
    return this.elements[0];
  }

  getQueue() {
    return this.elements;
  }

  checkFull(){
    if (this.elements.length >= 10){
      return true;
    }
    return false;
  }
  
  async response() {
    const completion = await this.openai.chat.completions.create({
      messages: [
        { role: "system", content: "Summarize the content that is given to you. Make sure that your summary accurately reflects the content given to you in the input. Make sure that it is formatted in maximum 2-3 bullet points. Make sure that you fix any errors in the text which may be present. If you are unable to access input, do not say anything." },
        { role: "user", content:  this.elements.join("")}],
      model: "gpt-3.5-turbo-0125",
    });
    console.log(completion.choices[0].message.content);
    document.getElementById("notesText").innerText += completion.choices[0].message.content + "\n\n";
    document.getElementById("notesTextDiv").scrollTo(0, document.getElementById("notesText").scrollHeight);
    this.elements = [];
  }

}

const queue = new Queue();

function start() {
  if(start1) { 
    document.getElementById("rawText").innerText += '\n---------- Recording Started. ----------'
    document.getElementById('voiceButton').style.backgroundColor = "red";
    document.getElementById('voiceButton').textContent = "Stop Recording!";
    alert("RECORDING STARTED! NOW LOGGING TRANSCRIPT FOR NOTES TAKING!")
    recognition.start();
  }
  else if (!start1) {
    recognition.stop();
    document.getElementById('voiceButton').style.backgroundColor = "#072345";
    document.getElementById('voiceButton').textContent = "Start Recording!";
    alert("RECORDING STOPPED! CHECK OUT YOUR NOTES BELOW!")
  }
  start1 = !start1;
}

document.getElementById('voiceButton').addEventListener('click', start);
document.getElementById('deleteButtonRaw').addEventListener('click', () => clearBox("rawText"));
document.getElementById('deleteButtonNotes').addEventListener('click', () => clearBox("notesText"));
document.getElementById('printButton').addEventListener('click', () => printNotes());

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

function printNotes() {
  var winPrint = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');
  winPrint.document.write(document.getElementById("notesText").innerHTML);
  winPrint.document.close();
  winPrint.focus();
  winPrint.print();
  winPrint.close();

}

function putToText() {
  document.getElementById("rawText").innerHTML = g.join("\n");
  document.getElementById("rawTextDiv").scrollTo(0, document.getElementById("rawText").scrollHeight);
}

recognition.onresult = event => {
    const result = event.results[event.results.length - 1];
    if(result.isFinal) {
      g.push(result[0].transcript);
      console.log(queue.getQueue());
      document.getElementById("rawText").innerText += "\n\n" + g[index].toString();
      document.getElementById("rawTextDiv").scrollTo(0, document.getElementById("rawText").scrollHeight);
      index += 1;
      if (queue.checkFull()) {
        console.log("full");
        queue.response();
      }

      queue.enqueue(result[0].transcript);
    }
};

recognition.onend = () => {
  g = [];
  index = 0;
  queue.response();
  document.getElementById("rawText").innerText += "\n\n" + '---------- Recording Stopped. ----------';
  console.log('finished')
};

recognition.onerror = event => {
    console.error('Speech recognition error:', event.error);
};

recognition.onnomatch = () => {
    console.log('No speech was recognized.');
};



