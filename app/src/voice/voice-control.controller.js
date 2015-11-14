(function () {
  'use strict';

  angular.module('kjApp')
      .controller('VoiceControlController', VoiceControlController);

  VoiceControlController.$inject = [
    'speechRecognitionService', 'speechSynthesisService',
    '$scope', '$mdDialog'];

  /* @ngInject */
  function VoiceControlController(speechRecognitionService,
      speechSynthesisService, $scope, $mdDialog) {
    var vm = this;

    var mateImageIndex = getRandomInt(1, 8);
    vm.mateImage = 'assets/mate_' + mateImageIndex + '.png';
    vm.transcript = '';
    vm.isFinal = false;
    vm.processing = false;
    vm.onAudioEnded = onAudioEnded;

    function onAudioEnded() {
      console.log('Start listening.');
      speechRecognitionService.record(false, {
        onResult: onResult,
        onInterimResult: onInterimResult,
        onEnd: onEnd
      });
    }

    function onInterimResult(result) {
      vm.transcript = result;
      $scope.$apply();
    }

    function onResult(result) {
      vm.isFinal = true;
      vm.transcript = result;
      $scope.$apply();
    }

    function onEnd() {
      console.log('Finished listening on dialog.');
      if (vm.transcript && vm.isFinal) {
        console.log('Processing command.');
        vm.processing = true;
        // voiceCommandsService.process(vm.transcript);
      } else {
        speechSynthesisService.speak('Sorry. I did not catch that.');
        $mdDialog.hide();
      }
      $scope.$apply();
    }

    function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    }
  }
})();
