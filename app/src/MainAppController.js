/**
 * Created by diegob on 03.10.15.
 */

(function () {
  'use strict';

  window.kj = window.kj || {};
  var kj = window.kj;

  kj.MainAppController = function($state, $mdSidenav, $mdDialog, Recorder, timerService, temperatureService, currentRecipeService) {
    this.$state_ = $state;
    this.$mdSidenav_ = $mdSidenav;
    this.$mdDialog_ = $mdDialog;
    this.recorderService = Recorder;
  };

  kj.MainAppController.prototype.toggleLeftSidenav = function() {
    this.$mdSidenav_('left').toggle();
  };

  kj.MainAppController.prototype.showGraph  = function(ev) {
    this.$mdDialog_.show({
      templateUrl: 'src/graph-dialog.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:true
    });
  };

  kj.module.controller('MainAppController', kj.MainAppController);
})();