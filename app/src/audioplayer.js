/**
 * Created by diegob on 03.10.15.
 */

(function () {
  'use strict';

  window.kj = window.kj || {};
  var kj = window.kj;


  kj.module.directive('audioPlayer', function($document) {
    return {
      restrict: 'E',
      template: '<audio id="player"></audio>',
      scope: {

      },
      link: function(_, element) {
        $document = $document[0];
        element = element[0];
        var audioPlayer = element.querySelector('#player');
        var playing = false;
        var url = null;
        audioPlayer.addEventListener('ended', function() {
          playing = false;
        });
        audioPlayer.addEventListener('playing', function() {
          playing = true;
        });
        audioPlayer.onload = function() {
          URL.revokeObjectURL(url);
        };
        function playAudio(event) {
          console.log('Time to play');
          url = URL.createObjectURL(event.detail.audioBlob);
          if (!playing) {
            audioPlayer.src = url;
            audioPlayer.load();
            audioPlayer.play();
          } else {
            console.log('Something was playing!');
          }
        }
        $document.addEventListener('audioAvailable', playAudio);
      }
    }
  })
})();