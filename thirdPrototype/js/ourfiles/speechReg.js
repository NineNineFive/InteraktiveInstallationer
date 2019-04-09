
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;
var recognition = new window.SpeechRecognition();


var finalTranscript = '';
var interimTranscript = '';
var newFinal = false;

class SpeechReg {
    constructor() {
        this.setupSpeecRecog();
    }


    setupSpeecRecog() {
        var instance = this;

        this.words = ['fire', "shoot", "close", "left", "right", "pew pew", "A2", "A5"];
        this.grammar = '#JSGF V1.0; grammar this.words; public <word> = ' + this.words.join(' | ') + ' ;'
        this.recognition = new SpeechRecognition();
        this.speechRecognitionList = new SpeechGrammarList();
        this.speechRecognitionList.addFromString(this.grammar, 1);
        this.recognition.grammars = this.speechRecognitionList;
        this.recognition.lang = 'en-US';
        this.recognition.interimResults = true;
        this.recognition.maxAlternatives = 10;
        this.recognition.continuous = false;
        this.recognition.onspeechend = function () {
            console.log('Speech has stopped being detected... restarting');
            instance.setupSpeecRecog();
        }
        this.recognition.onresult = (event) => {

            for (let i = event.resultIndex, len = event.results.length; i < len; i++) {
                let transcript = event.results[i][0].transcript.split(" ");
                if (event.results[i].isFinal) {
                    finalTranscript = transcript;
                    newFinal = true;
                    console.log(finalTranscript);
                    this.recognition.stop();
                    instance.setupSpeecRecog();

                } else {
                    interimTranscript = transcript;
                    for(var i = 0; i < transcript.length; i++) {
                        console.log(transcript[i]);
                    }

                }
            }

        }
        this.recognition.start();
    }




}

var test = new SpeechReg();





























