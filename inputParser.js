export default class InputParser {
  /**
   * @constructor
   * init web speech object
   *
   **/
  constructor() {
    window.SpeechRecognition =
      window.webkitSpeechRecognition || window.SpeechRecognition; // checks if the browser supports the Web Speech API
    this.recognition = new window.SpeechRecognition(); // create new speech recognition obj
    this.recognition.lang = 'en-US'; // set lang
    this.recognition.continuous = true; // set listening to always
    this.recognition.interimResults = true; // set constant output stream
  }

  /**
   * @function listen
   * @return {Array} speechArr
   * Listen for speech input
   * listens continuously, compensating for gaps
   * for each gap or pause, current chunk of speech added to speechArr
   * whole speech transcript returned when end fucntion is called
   **/
  listen() {
    let transcript = '';
    let speechArr = [];
    this.recognition.start(); // start listening
    this.recognition.addEventListener('result', event => {
    const result = event.results[event.results.length - 1][0].transcript;
    transcript = result; // set transcript to result
    console.log(transcript);
    if (event.results[event.results.length - 1].isFinal) {
      speechArr.push(transcript);
      console.log(speechArr);
      transcript = '';
    }
  });

    this.recognition.addEventListener('end', () => {
      console.log('end');
      if (transcript != '') {
        speechArr.push(transcript);
      }
      console.log(speechArr);
      return speechArr;
    });
  }

  stop() {
    this.recognition.stop();
  }
}

