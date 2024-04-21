const path = require('path');
module.exports = {
  entry: './main.js', 
  output: {
    filename: 'app.js', 
    path: path.resolve(__dirname, 'dist'), 
  },
  target: 'web',
};