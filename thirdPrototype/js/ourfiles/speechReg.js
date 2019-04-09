
class SpeechReg {
    constructor () {
        var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
        var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
        var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

        //var colors = [ 'aqua' , 'azure' , 'beige', 'bisque', 'black', 'blue', 'brown', 'chocolate', 'coral', 'crimson', 'cyan', 'fuchsia', 'ghostwhite', 'gold', 'goldenrod', 'gray', 'green', 'indigo', 'ivory', 'khaki', 'lavender', 'lime', 'linen', 'magenta', 'maroon', 'moccasin', 'navy', 'olive', 'orange', 'orchid', 'peru', 'pink', 'plum', 'purple', 'red', 'salmon', 'sienna', 'silver', 'snow', 'tan', 'teal', 'thistle', 'tomato', 'turquoise', 'violet', 'white', 'yellow'];
        var colors = ['fire', "shoot", "close", "left", "right", "pew pew","A2", "A5"];

        var grammar = '#JSGF V1.0; grammar colors; public <color> = ' + colors.join(' | ') + ' ;'

        var recognition = new SpeechRecognition();
        var speechRecognitionList = new SpeechGrammarList();
        speechRecognitionList.addFromString(grammar, 1);
        recognition.grammars = speechRecognitionList;
        recognition.continuous = true;
        recognition.lang = 'en-US';
        recognition.interimResults = true;
        recognition.maxAlternatives = 10;

        var diagnostic = document.querySelector('.output');

        recognition.start();
        recognition.onspeechstart = function() {

            console.log('Ready to receive a color command.');
        }

        recognition.onresult = function(event) {
            var last = event.results.length - 1;
            var color = event.results[last][0].transcript.split(" ");
            console.log(event);
            //var color = event.results[last][0].transcript.split(" ");

            for(var i = 0; i < color.length; i++){
                console.log("color: "+color[i]);
            }
            console.log('Confidence: ' + event.results[0][0].confidence);
        }

        recognition.onspeechend = function() {
            //recognition.stop();

        }

        recognition.onnomatch = function(event) {
            console.log("I didn't recognise that color.");
        }

        recognition.onerror = function(event) {
            console.log('Error occurred in recognition: ' + event.error);
        }
    }

    test(){



    }



}


var speechreg = new SpeechReg();



























