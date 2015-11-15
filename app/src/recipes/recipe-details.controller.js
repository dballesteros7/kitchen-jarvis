/**
 * Created by diegob on 03.10.15.
 */

(function () {
  'use strict';

  angular.module('kjApp')
      .controller('RecipeDetailsController', RecipeDetailsController);

  RecipeDetailsController.$inject = ['$stateParams', 'recipeService', 'currentRecipeService', 'voiceControlService'];

  /* @ngInject */
  function RecipeDetailsController($stateParams, recipeService,
                                   currentRecipeService, voiceControlService) {
    var vm = this;
    vm.recipeId = null;
    vm.recipe = null;
    vm.recipeRating = [];
    vm.isCurrentRecipe = false;

    vm.toReadableTime = toReadableTime;
    vm.cookRecipe = cookRecipe;
    vm.stopCooking = stopCooking;

    activate();

    // -------------------------------------------------------------------------
    function activate() {
      vm.recipeId = $stateParams.recipeId;
      recipeService.getRecipe(vm.recipeId)
          .then(onRecipeLoaded)
          .catch(onError);
    }

    function onRecipeLoaded(recipeData) {
      vm.recipe = recipeData;
      vm.attribution = vm.recipe.attribution.html
          .replace(/http:\/\//g, 'https://');
      for (var i = 0; i < vm.recipe.rating; i++) {
        vm.recipeRating.push(1);
      }
      vm.recipeImage = vm.recipe.images[0].hostedLargeUrl
          .replace(/http:\/\//g, 'https://');
      vm.isCurrentRecipe = currentRecipeService.getRecipe() &&
          currentRecipeService.getRecipe().id === vm.recipe.id;
      if (vm.isCurrentRecipe) {
        voiceControlService.activate();
      }
    }

    function onError(err) {
      console.log(err);
    }

    function toReadableTime(timeInSeconds) {
      return (timeInSeconds / 60) + ' minutes';
    }

    function cookRecipe() {
      currentRecipeService.setRecipe(vm.recipe);
      vm.isCurrentRecipe = true;
      voiceControlService.activate();
    }

    function stopCooking() {
      currentRecipeService.clearRecipe();
      vm.isCurrentRecipe = false;
      voiceControlService.deactivate();
    }
  }
})();
