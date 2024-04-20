const InputParser = require('./inputParser');
const inputParser = new InputParser();

inputParser.listen();
setTimeout(() => {
  inputParser.stop();
}, 10000);


