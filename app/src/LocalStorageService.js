/**
 * Created by diegob on 03.10.15.
 */

(function () {
  'use strict';

  window.kj = window.kj || {};
  var kj = window.kj;

  kj.LocalStorageService = function($window) {
    this.localStorage = $window.localStorage;
  };

  kj.LocalStorageService.prototype.setItem = function(key, value) {
    this.localStorage.setItem(key, value);
  };

  kj.LocalStorageService.prototype.getItem = function(key) {
    return this.localStorage.getItem(key);
  };

  kj.LocalStorageService.prototype.removeItem = function(key) {
    return this.localStorage.removeItem(key);
  };

  kj.module.service('localStorageService', ['$window', kj.LocalStorageService]);
})();