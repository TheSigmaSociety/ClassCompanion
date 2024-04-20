import InputParser from './inputParser.js';
const inputParser = new InputParser();

inputParser.listen();
setTimeout(() => {
  inputParser.stop();
}, 10000);


