(function () {
  'use strict';

  angular.module('kjApp')
      .service('voiceControlService', voiceControlService);

  voiceControlService.$inject = ['speechRecognitionService', '$mdDialog'];

  /* @ngInject */
  function voiceControlService(speechRecognitionService, $mdDialog) {
    var svc = this;
    var hotword = 'listen mate';
    var hotwordDetected = false;
    var dialogOpened = false;
    var resultReceived = false;
    var activated = false;

    var listeners = {
      onResult: onResult,
      onEnd: onEnd
    };
    svc.activate = activate;
    svc.deactivate = deactivate;

    // -------------------------------------------------------------------------
    function activate() {
      if (!activated) {
        activated = true;
        speechRecognitionService.record(true, listeners);
      }
    }

    function deactivate() {
      activated = false;
      speechRecognitionService.stop();
    }

    function onResult(result) {
      console.log('Got a result.');
      console.log(result);
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
        if (activated) {
          speechRecognitionService.record(true, listeners);
        }
      } else {
        console.log('Showing dialog.');
        hotwordDetected = false;
        $mdDialog.show({
          templateUrl: '/src/voice/views/listening-dialog.html',
          controller: 'VoiceControlController',
          controllerAs: 'vm',
          onComplete: onDialogOpened
        }).finally(onDialogClosed);
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
      if (activated) {
        speechRecognitionService.record(true, listeners);
      }
    }
  }
})();
