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
    this.elements = {};
    this.frontIndex = 0;
    this.backIndex = 0;
    this.openai = new OpenAI({ apiKey: OPENAI_API_KEY, dangerouslyAllowBrowser: true});
  }

  /** Inserts a new element to the back of the queue
   * Parameter: the element to be inserted
   * Return: nothing
   */
  enqueue(x) {
    this.elements[this.backIndex] = x;
    this.backIndex++;
    return 'Inserted ' + x + ' into the queue';
  }

  /** Removes the first element of the queue
   * Parameters: none
   * Return: the removed element
   */
  dequeue() {
    const element = this.element[this.frontIndex];
    delete this.elements[this.frontIndex];
    this.frontIndex++;
    return element;
  }
  
  /** Gets the first element inside the queue
   * Parameters: none
   * Return: the first element inside the queue
   */
  getFrontElement() {
    return this.elements[this.frontIndex];
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
    if (this.elements.lenght >= 5){
      return true;
    }
    return false;
  }
  
  async response() {
    const completion = await this.openai.chat.completions.create({
      messages: [{ role: "system", content: "You are a helpful assistant." }],
      model: "gpt-3.5-turbo-0125",
    });
    console.log(completion.choices[0].message.content);
  }
}

const queue = new Queue();
queue.response();

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
      document.getElementById("rawText").textContent += "\n" + g[index].toString();
      index += 1;
    }
};

recognition.onend = () => {
  g = [];
  index = 0;
  document.getElementById("rawText").textContent += "\n" + 'Recording Stopped.';
  console.log('finished')
};

recognition.onerror = event => {
    console.error('Speech recognition error:', event.error);
};

recognition.onnomatch = () => {
    console.log('No speech was recognized.');
};



