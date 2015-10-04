/**
 * Created by diegob on 02.10.15.
 */
(function () {
  'use strict';

  window.kj = window.kj || {};
  var kj = window.kj;

  kj.Recorder = function($window, $rootScope, $document, $mdToast) {
    this.rec = new webkitSpeechRecognition();
    this.rec.continuous = true;
    this.rec.interimResults = true;
    this.rec.lang = 'en-US';
    this.rec.onstart = this.onStart.bind(this);
    this.rec.onerror = this.onError.bind(this);
    this.rec.onresult = this.onResult.bind(this);
    this.rec.onend = this.onEnd.bind(this);
    this.rec.start();

    //$window.setInterval(this.watchDog.bind(this), 1000);
    this.lastResultTime = 0;
    this.result = '';
    this.$scope_ = $rootScope;
    this.enabled_ = true;
    this.isRecording = false;
    this.$mdToast_ = $mdToast;
    this.voiceStatus = {
      listening: 'Inactive',
      lastResult: '',
      guess: ''
    };
  };

  Object.defineProperty(kj.Recorder.prototype, 'enabled', {
    get: function() {
      return this.enabled_;
    },
    set: function(value) {
      this.enabled_ = value;
      if (this.enabled_) {
        this.rec.start();
      } else {
        this.rec.stop();
      }
    }
  });

  kj.Recorder.prototype.showMessage = function(message) {
    console.log(message);
  };

  kj.Recorder.prototype.onStart = function(event) {
    console.log('Started listening.');
    console.log(event);
    this.voiceStatus.listening = 'Listening started.'
    this.lastResultTime = Date.now();
    this.isRecording = true;
    this.$scope_.$apply();
  };

  kj.Recorder.prototype.onEnd = function(event) {
    console.log('Listening ended.');
    console.log(event);
    this.isRecording = false;
    this.voiceStatus.listening = 'Listening ended.';
    if (this.enabled_) {
      this.rec.start();
    }
    this.$scope_.$apply();
  };

  kj.Recorder.prototype.onError = function(event) {
    console.log('Oops, an error.');
    console.log(event);
    if (event.error === 'aborted') {
      this.enabled_ = false;
      this.voiceStatus.listening = 'Aborted because the microphone is busy.';
    } else {
      this.voiceStatus.listening = 'Found an error while listening, ' + event.error + '. Restarting now.';
    }
    this.rec.stop();
  };

  kj.Recorder.prototype.onResult = function(event) {
    console.log('Received a result.');
    console.log(event);
    console.log(Date.now());
    var found = false;
    this.lastResultTime = Date.now();
    this.voiceStatus.guess = '';
    for (var i = event.resultIndex; i < event.results.length; i++) {
      if (event.results[i].isFinal) {
        var result = event.results[i][0].transcript;
        result = result.trim().toLowerCase();
        console.log('Checking result...');
        console.log(result);
        this.voiceStatus.lastResult = result;
        found = true;
        for (var j = 0; j < kj.VoiceService.VOICES.length; j++) {
          var helper = kj.VoiceService.VOICES[j];
          var helperIndex = result.indexOf(helper.name.toLowerCase());
          if (helperIndex > -1) {
            result = result.substring(helperIndex + helper.name.length);
            this.$scope_.$broadcast('speechResult', {
              text: result,
              voiceModel: helper.value,
              swear: helper.name === 'Gordon' || helper.name === 'Garden'
            });
            break;
          }
        }
      } else {
        this.voiceStatus.guess += event.results[i][0].transcript;
      }
    }
    this.$scope_.$apply();
    if (found) {
      this.rec.stop();
    }
  };

  kj.Recorder.prototype.watchDog = function() {
    var now = Date.now();
    if (this.enabled_ && now - this.lastResultTime > 10000) {
      console.log('Timed out.');
      this.rec.stop();
    }
  };

  kj.module.service('Recorder', kj.Recorder);
})();