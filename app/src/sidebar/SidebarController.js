/**
 * Created by diegob on 03.10.15.
 */

(function () {
  'use strict';

  window.kj = window.kj || {};
  var kj = window.kj;

  kj.SidebarController = function($window, $state, $mdSidenav, recipeService, Recorder, currentRecipeService, voiceService) {
    this.$window_ = $window;
    this.$state_ = $state;
    this.$mdSidenav_ = $mdSidenav;
    this.currentRecipe = null;
    this.recipeService = recipeService;
    this.currentRecipeService_ = currentRecipeService;
    this.recorderService = Recorder;
    this.voiceService = voiceService;
  };

  kj.SidebarController.prototype.navigateTo = function(state) {
    this.$state_.go(state);
    this.toggleLeftSidenav();
  };

  kj.SidebarController.prototype.toggleLeftSidenav = function() {
    this.$mdSidenav_('left').toggle();
  };

  kj.SidebarController.prototype.goToCurrentRecipe = function() {
    this.currentRecipeService_.getCurrentRecipe().then(function(recipe) {
      this.$state_.go('recipeView', {recipeId: recipe.RecipeID});
      this.toggleLeftSidenav();
    }.bind(this));
  };

  kj.SidebarController.prototype.hasCurrentRecipe = function() {
    return this.currentRecipeService_.recipe;
  };

  kj.SidebarController.prototype.getCurrentRecipe = function() {
    return this.currentRecipeService_.recipe;
  };

  kj.module.controller('SidebarController', kj.SidebarController);
})();