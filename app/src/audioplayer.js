/**
 * Created by diegob on 03.10.15.
 */

(function () {
  'use strict';

  window.kj = window.kj || {};
  var kj = window.kj;


  kj.module.directive('audioPlayer', audioPlayer);

  function audioPlayer() {
    return {
      restrict: 'E',
      template: '<audio id="player"></audio>',
      scope: {
        src: '@',
        onAudioEnded: '='
      },
      link: function(scope, element) {
        element = element[0];
        var audioPlayer = element.querySelector('#player');
        var playing = false;

        activate();

        function activate() {
          audioPlayer.addEventListener('ended', function() {
            playing = false;
            scope.onAudioEnded();
          });
          audioPlayer.addEventListener('playing', function() {
            playing = true;
          });
          playAudio();
        }
        function playAudio() {
          if (!scope.src) {
            console.log('Nothing to play.');
            return;
          }
          if (playing) {
            console.log('Something is already playing.');
            return;
          }
          audioPlayer.src = scope.src;
          audioPlayer.load();
          audioPlayer.play();
        }
      }
    }
  }
})();
