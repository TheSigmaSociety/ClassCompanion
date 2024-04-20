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

    this.recognition.start(); // start speech recognition module
    this.recognition.addEventListener('result', event => { // callback
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');
      transcript += result; // append result to transcript
      console.log(transcript);
      if (results.isFinal) {
        // if the current response obj is marked final
        speechArr.push(transcript); // push existing transcript
        transcript = ''; // clear transcript
        console.log(speechArr); // log speechArr
      }
    }); 

    this.recognition.addEventListener('end', () => {
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

