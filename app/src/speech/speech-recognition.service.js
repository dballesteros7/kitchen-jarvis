(function () {
  'use strict';

  angular.module('kjApp')
      .factory('speechRecognitionService', speechRecognitionService);

  speechRecognitionService.$inject = ['$window'];

  /* @ngInject */
  function speechRecognitionService($window) {
    var svc = {
      record: record,
      setListeners: setListeners,
      stop: stop
    };

    var recorder = null;
    var recording = false;
    var nonStopRecording = false;
    var resultReceived = false;
    var onResultListener = null;
    var onEndListener = null;
    var onInterimResultListener = null;

    activate();

    return svc;

    function activate() {
      if (!('webkitSpeechRecognition' in $window)) {
        console.log('No speech recognition support.');
        throw new Error('No speech recognition support.');
      }
      recorder = new webkitSpeechRecognition();
      recorder.interimResults = true;
      recorder.lang = 'en-US';
      recorder.addEventListener('start', onStart);
      recorder.addEventListener('error', onError);
      recorder.addEventListener('end', onEnd);
      recorder.addEventListener('result', onResult);
      recorder.addEventListener('nomatch', onNoMatch);
      setListeners();
    }

    function record(nonStop, listeners) {
      nonStopRecording = nonStop;
      setListeners(listeners);
      recorder.start();
    }

    function stop() {
      setListeners();
      recorder.stop();
    }

    function onStart() {
      console.log('Recording started.');
      recording = true;
      resultReceived = false;
    }

    function onError(errorEvent) {
      console.log('Received a recording error.');
      console.log(errorEvent);
      switch (errorEvent.error) {
        case 'no-speech':
          // Allow retry.
          break;
        case 'aborted':
        case 'audio-capture':
        case 'network':
        case 'not-allowed':
        case 'service-not-allowed':
          console.log('Received a non-recoverable error.');
          console.log(errorEvent);
          nonStopRecording = false;
          break;
      }
      recorder.stop();
    }

    function onEnd() {
      console.log('Recording ended.');
      recording = false;
      if (!resultReceived && nonStopRecording) {
        recorder.start();
      } else {
        onEndListener();
      }
    }

    function onNoMatch() {
      console.log('Listened but found no match.');
    }

    function onResult(speechEvent) {
      console.log('Received a result');
      var result = speechEvent.results[speechEvent.resultIndex];
      if (result !== undefined) {
        if (result.isFinal) {
          resultReceived = true;
          onResultListener(result[0].transcript);
          console.log('Final result. ' + result[0].transcript);
          recorder.stop();
        } else {
          onInterimResultListener(result[0].transcript);
          console.log('Interim result. ' + result[0].transcript);
        }
      }
    }

    function setListeners(listeners) {
      listeners = listeners || {};
      onResultListener = listeners.onResult || function() {};
      onInterimResultListener = listeners.onInterimResult || function() {};
      onEndListener = listeners.onEnd || function() {};
    }
  }
})();
