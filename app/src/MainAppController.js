/**
 * Created by diegob on 03.10.15.
 */

(function () {
  'use strict';

  window.kj = window.kj || {};
  var kj = window.kj;

  kj.MainAppController = function($state, $mdSidenav, Recorder, timerService, currentRecipeService) {
    this.$state_ = $state;
    this.$mdSidenav_ = $mdSidenav;
    this.recorderService = Recorder;
  };

  kj.MainAppController.prototype.toggleLeftSidenav = function() {
    this.$mdSidenav_('left').toggle();
  };

  kj.module.controller('MainAppController', kj.MainAppController);
})();