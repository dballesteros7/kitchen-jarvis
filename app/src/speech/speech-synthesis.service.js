(function () {
  'use strict';

  angular.module('kjApp')
      .service('speechSynthesisService', speechSynthesisService);

  speechSynthesisService.$inject = ['$window'];

  /* @ngInject */
  function speechSynthesisService($window) {
    var svc = this;

    svc.speak = speak;

    var voices = [];
    var playing = false;

    activate();

    // -------------------------------------------------------------------------

    function activate() {
      if (!('speechSynthesis' in $window)) {
        console.log('No speech synthesis support.');
        throw new Error('No speech synthesis support.');
      }
      $window.speechSynthesis.addEventListener('voiceschanged', function() {
        console.log('Voices loaded.');
        voices = $window.speechSynthesis.getVoices();
      });
    }

    function speak(message) {
      if (voices.length === 0) {
        console.log('No voices loaded.');
      } else if (playing) {
        console.log('Already playing something, dropping current message.');
      } else {
        var utterance = new SpeechSynthesisUtterance(message);
        utterance.voice = voices[1];
        utterance.addEventListener('end', onMessageEnd);
        $window.speechSynthesis.speak(utterance);
        playing = true;
      }

      function onMessageEnd() {
        playing = false;
        console.log('Finished speaking utterance.');
      }
    }
  }
})();
