/**
 * Created by diegob on 03.10.15.
 */

(function () {
  'use strict';

  window.kj = window.kj || {};
  var kj = window.kj;

  kj.TokenManager = function(backend, $http, $q) {
    this.$http_ = $http;
    this.$q_ = $q;
    this.backend_ = backend;
    this.token_ = null;
  };

  kj.TokenManager.TTL = 3600000; // 1 hour

  kj.TokenManager.prototype.getToken = function() {
    if (this.token_) {
      var now = Date.now();
      if (now - this.token_.startTime > kj.TokenManager.TTL) {
        return this.requestToken_();
      }
      return this.$q_.when(this.token_.encodedToken);
    }
    return this.requestToken_();
  };

  kj.TokenManager.prototype.requestToken_ = function() {
    return this.$http_({
      url: this.backend_ + '/tokens/api/v1.0/watson_token',
      method: 'GET'
    }).then(function(response) {
      this.token_ = {
        encodedToken: response.data.response,
        startTime: Date.now()
      };
      return this.token_.encodedToken;
    }.bind(this)).catch(function(error) {
      console.error(error);
      this.token_ = null;
      return null;
    }.bind(this));
  };

  kj.module.service('tokenManager', ['backend', '$http', '$q', kj.TokenManager]);
})();