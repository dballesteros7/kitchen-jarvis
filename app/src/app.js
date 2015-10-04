/**
 * Created by diegob on 02.10.15.
 */
(function () {
  'use strict';

  window.kj = window.kj || {};
  var kj = window.kj;

  kj.module = angular
      .module('kjApp', ['ngMaterial', 'ui.router', 'firebase'])
          .constant('backend', 'https://rec3po.cloudapp.net')
          .constant('firebase', 'https://gourmate.firebaseio.com')
          .config(function($mdThemingProvider) {
            $mdThemingProvider
                .theme('default')
                    .primaryPalette('deep-orange')
                    .accentPalette('indigo')
                    .warnPalette('pink');
          });
})();