import OpenAI from 'openai';
import { OPENAI_API_KEY } from './key';

export default class Queue {

  /** The constructor for the queue
   * elements: list of the elements inside the queue
   * frontIndex: the frontmost index inside the queue
   * backIndex: the backmost index inside the queue
   */
  constructor() {
    this.elements = {};
    this.frontIndex = 0;
    this.backIndex = 0;
    const openai = new OpenAI({ apiKey: OPENAI_API_KEY, dangerouslyAllowBrowser: true});
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

}

async function main() {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: "You are a helpful assistant." }],
    model: "gpt-3.5-turbo-0125",
  });

  console.log(completion.choices[0].message.content);
}

main();

const q = new Queue();
console.log(q.getQueue());
