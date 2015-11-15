/**
 * Created by diegob on 03.10.15.
 */

(function () {
  'use strict';

  angular.module('kjApp')
      .service('localStorageService', localStorageService);

  localStorageService.$inject = ['$window'];

  /* @ngInject */
  function localStorageService($window) {
    var svc = this;
    svc.setItem = setItem;
    svc.getItem = getItem;
    svc.removeItem = removeItem;

    // ------------------------------------------------------------------------
    function setItem(key, value) {
      $window.localStorage.setItem(key, value);
    }

    function getItem(key) {
      return $window.localStorage.getItem(key);
    }

    function removeItem(key) {
      return $window.localStorage.removeItem(key);
    }
  }
})();
