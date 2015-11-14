(function () {
  'use strict';

  angular.module('kjApp')
      .service('voiceControlService', voiceControlService);

  voiceControlService.$inject = ['speechRecognitionService', '$mdDialog'];

  /* @ngInject */
  function voiceControlService(speechRecognitionService, $mdDialog) {
    var hotword = 'listen mate';
    var hotwordDetected = false;
    var dialogOpened = false;
    var resultReceived = false;

    var listeners = {
      onResult: onResult,
      onEnd: onEnd
    };
    activate();

    // -------------------------------------------------------------------------
    function activate() {
      speechRecognitionService.record(true, listeners);
    }

    function onResult(result) {
      console.log('Got a result.');
      console.log(result);
      if (dialogOpened) {
        return;
      }
      resultReceived = true;
      if (result.toLowerCase() === hotword) {
        hotwordDetected = true;
        console.log('Hot word detected.');
      }
    }

    function onEnd() {
      console.log('Recording ended after result.');
      if (!hotwordDetected) {
        console.log('No hotword, restarting recording.');
        speechRecognitionService.record(true, listeners);
      } else {
        console.log('Showing dialog.');
        $mdDialog.show({
          templateUrl: '/src/voice/views/listening-dialog.html',
          controller: 'VoiceControlController',
          controllerAs: 'vm',
          onComplete: onDialogOpened
        }).finally(onDialogClosed);
        hotwordDetected = false;
      }
    }

    function onDialogOpened() {
      console.log('Dialog opened.');
      dialogOpened = true;
    }

    function onDialogClosed() {
      console.log('Dialog closed.');
      dialogOpened = false;
      speechRecognitionService.stop();
      speechRecognitionService.record(true, listeners);
    }
  }
})();
