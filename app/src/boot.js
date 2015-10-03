/**
 * Created by diegob on 02.10.15.
 */


(function () {
  'use strict';

  window.kj = window.kj || {};
  var kj = window.kj;

  kj.module.config(['$mdIconProvider', function($mdIconProvider) {
    $mdIconProvider.fontSet('fa', 'fa');
  }]);

})();