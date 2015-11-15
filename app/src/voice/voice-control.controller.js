(function () {
  'use strict';

  angular.module('kjApp')
      .controller('VoiceControlController', VoiceControlController);

  VoiceControlController.$inject = [
    'speechRecognitionService', 'speechSynthesisService', 'voiceCommandService',
    '$scope', '$mdDialog'];

  /* @ngInject */
  function VoiceControlController(speechRecognitionService,
      speechSynthesisService, voiceCommandService, $scope, $mdDialog) {
    var vm = this;

    var mateImageIndex = getRandomInt(1, 8);
    vm.mateImage = 'assets/mate_' + mateImageIndex + '.png';
    vm.transcript = '';
    vm.isFinal = false;
    vm.processing = false;

    activate();

    function activate() {
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
      function closeDialog() {
        $mdDialog.hide();
      }
      if (vm.transcript && vm.isFinal) {
        console.log('Processing command.');
        vm.processing = true;
        voiceCommandService.process(vm.transcript, closeDialog);
      } else {
        speechSynthesisService.speak('Sorry. I did not hear that.', closeDialog);
      }
      $scope.$apply();
    }

    function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    }
  }
})();
