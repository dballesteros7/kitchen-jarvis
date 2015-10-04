/**
 * Created by diegob on 03.10.15.
 */

(function () {
  'use strict';

  window.kj = window.kj || {};
  var kj = window.kj;

  kj.TimerService = function($window, $rootScope, $mdToast, voiceService) {
    this.$window_ = $window;
    this.$rootScope_ = $rootScope;
    this.$mdToast_ = $mdToast;
    this.voiceService_ = voiceService;
    this.reminders_ = [];

    console.log('Reminders enabled');
    this.$rootScope_.$on('speechResult', this.onSpeechResult.bind(this));
  };

  kj.TimerService.prototype.startTimer = function(reminder, duration, voiceModel) {
    this.reminders_.push(reminder);
    this.$window_.setTimeout(this.onTimerDone.bind(this), duration, reminder, voiceModel);
    this.voiceService_.play('I will remind you.', voiceModel);
  };

  kj.TimerService.prototype.onTimerDone = function(reminder, voiceModel) {
    console.log(reminder);
    this.voiceService_.play('Remember to ' + reminder, voiceModel);
  };

  kj.TimerService.prototype.onSpeechResult = function(event, detail) {
    console.log('onResult timer enter ' + Date.now());
    var text = detail.text.toLowerCase();
    var hotPhrase = 'remind me to';
    var endOfIndex = text.indexOf(hotPhrase);
    if (endOfIndex > -1) {
      event.preventDefault();
      var inPos = text.lastIndexOf(' in ');
      if (inPos > -1) {
        var toRemind = text.substring(endOfIndex + hotPhrase.length, inPos);
        var values = nlp.pos(text.substring(inPos)).values();
        var units = nlp.pos(text.substring(inPos)).nouns();
        if (values.length > 0 && units.length > 0) {
          var value = nlp.value((values[0].normalised)).number();
          var unit = nlp.noun(units[0].normalised).singularize();
          console.log('Creating reminder to: ' + toRemind);
          console.log('Value: ' + value);
          console.log('In units: ' + unit);
          this.startTimer(toRemind, kj.TimerService.UNITS[unit] * value, detail.voiceModel);
        }
      }
    }
    console.log('onResult timer exit ' + Date.now());
  };

  kj.TimerService.UNITS = {
    'second': 1000,
    'minute': 1000 * 60,
    'hour': 1000 * 60 * 60
  };

  kj.module.service('timerService', kj.TimerService);
})();