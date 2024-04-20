import { Queue } from 'queue.js';

require('dotenv').config();
const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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