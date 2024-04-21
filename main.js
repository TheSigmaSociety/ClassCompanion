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
        { role: "system", content: "summarize and provide detailed notes from the following sentences from a live speech transcript. correct for any unintended mistakes. each input from the transcript is around 10 sentences long, separated by /" },
        { role: "user", content:  this.elements.join("/")}],
      model: "gpt-3.5-turbo-0125",
    });
    console.log(completion.choices[0].message.content);
    this.elements = [];
  }
}

const queue = new Queue();

function start() {
  if(start1) { 
    document.getElementById("rawText").innerText += '\n---------- Recording Started. ----------'
    recognition.start();
  }
  else {
    recognition.stop();
  }
  start1 = !start1;
}

document.getElementById('voiceButton').addEventListener('click', start);

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
  document.getElementById("rawText").innerText += "\n\n" + '---------- Recording Stopped. ----------';
  console.log('finished')
};

recognition.onerror = event => {
    console.error('Speech recognition error:', event.error);
};

recognition.onnomatch = () => {
    console.log('No speech was recognized.');
};



