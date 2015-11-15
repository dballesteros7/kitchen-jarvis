/**
 * Created by diegob on 03.10.15.
 */

(function () {
  'use strict';

  window.kj = window.kj || {};
  var kj = window.kj;

  kj.MainAppController = function($state, $mdSidenav, $mdDialog, timerService, temperatureService, currentRecipeService, userService) {
    this.$state_ = $state;
    this.$mdSidenav_ = $mdSidenav;
    this.$mdDialog_ = $mdDialog;
    this.userService_ = userService;
  };

  kj.MainAppController.prototype.toggleLeftSidenav = function() {
    this.$mdSidenav_('left').toggle();
  };

  kj.MainAppController.prototype.loginWithGoogle = function() {
    this.userService_.loginWithGoogle();
  };

  kj.MainAppController.prototype.getCurrentUser = function() {
    return this.userService_.currentUser;
  };

  kj.MainAppController.prototype.getStatus = function() {
    return {};
  };

  kj.MainAppController.prototype.signOut = function() {
    if (this.getCurrentUser()) {
      this.userService_.signOut();
    }
  };

  kj.module.controller('MainAppController', kj.MainAppController);
})();
