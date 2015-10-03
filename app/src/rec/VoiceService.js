/**
 * Created by diegob on 03.10.15.
 */

(function () {
  'use strict';

  window.kj = window.kj || {};
  var kj = window.kj;

  kj.VoiceService = function($http, $window, tokenManager, $document) {
    this.$http_ = $http;
    this.tokenManager_ = tokenManager;
    this.$document_ = $document[0];
    this.$window_ = $window;
    this.voices = kj.VoiceService.VOICES;
    if (this.$window_.localStorage.getItem(kj.VoiceService.VOICE_MODEL_KEY)) {
      this.voiceModel = this.$window_.localStorage.getItem(kj.VoiceService.VOICE_MODEL_KEY);
    } else {
      this.voiceModel = this.voices[0].value;
    }
  };

  kj.VoiceService.VOICES = [
    {
      name: 'Alfredo',
      value: 'en-US_MichaelVoice'
    }, {
      name: 'Jane',
      value: 'en-US_AllisonVoice'
    }, {
      name: 'Emily',
      value: 'en-US_LisaVoice'
    }, {
      name: 'Anna',
      value: 'en-GB_KateVoice'
    }
  ];
  kj.VoiceService.VOICE_MODEL_KEY = 'voiceModel';

  Object.defineProperty(kj.VoiceService.prototype, 'voiceModel', {
    get: function() {
      return this.voiceModel_;
    },
    set: function(value) {
      this.$window_.localStorage.setItem(kj.VoiceService.VOICE_MODEL_KEY, value);
      this.voiceModel_ = value;
    }
  });


  kj.VoiceService.prototype.play = function(text, voiceModel){
    this.tokenManager_.getToken().then(function(token) {
      if (token) {
        this.$http_({
          method: 'GET',
          url: 'https://stream.watsonplatform.net/text-to-speech/api/v1/synthesize',
          params: {
            text: text,
            voice: voiceModel
          },
          headers: {
            'X-Watson-Authorization-Token': token,
            'Accept': 'audio/ogg; codecs=opus'
          },
          responseType: 'blob'
        }).then(function(response) {
          var audioBlob = response.data;
          var event = new CustomEvent('audioAvailable', {
            detail: {
              audioBlob: audioBlob
            }
          });
          this.$document_.dispatchEvent(event);
        }.bind(this));
      }
    }.bind(this));
  };

  kj.module.service('voiceService', kj.VoiceService);
})();