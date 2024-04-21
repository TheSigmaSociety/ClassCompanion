import OpenAI from 'openai';
import { OPENAI_API_KEY } from './key';
const recognition = new webkitSpeechRecognition() || new SpeechRecognition();
recognition.interimResults = true;
recognition.continuous = true;
let index = 0;
let start1 = true;
let g = [];
class Queue {

  /** The constructor for the queue
   * elements: list of the elements inside the queue
   * frontIndex: the frontmost index inside the queue
   * backIndex: the backmost index inside the queue
   */
  constructor() {
    this.elements = [];
    this.openai = new OpenAI({ apiKey: OPENAI_API_KEY, dangerouslyAllowBrowser: true});
  }

  /** Inserts a new element to the back of the queue
   * Parameter: the element to be inserted
   * Return: nothing
   */
  enqueue(x) {
    this.elements.push(x);
  }

  /** Removes the first element of the queue
   * Parameters: none
   * Return: the removed element
   */
  dequeue() {
    const element = this.elements[0];
    delete this.elements[this.frontIndex];
    return element;
  }
  
  /** Gets the first element inside the queue
   * Parameters: none
   * Return: the first element inside the queue
   */
  getFrontElement() {
    return this.elements[0];
  }

  /** Gets the list of items in the queue
   * Parameters: none
   * Return: the list of items in the queue 
   */
  getQueue() {
    return this.elements;
  }

  /** Checks if the queue is full (has 5 elements)
   * Parameters: none
   * Return: True if queue has 5 elements
   */
  checkFull(){
    if (this.elements.length >= 10){
      return true;
    }
    return false;
  }
  
  async response() {
    const completion = await this.openai.chat.completions.create({
      messages: [
        { role: "system", content: "summarize and provide one sentence of notes for each input from the transcript. Make sure they accurately reflect the topic of the notes, as students will be using these in order to study, but also make sure they are not too long as the point is to summarize it concicely for the students use. correct for any unintended mistakes. each input from the transcript is around 10 sentences long. If you are unable to access the transcript, do not return anything." },
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



