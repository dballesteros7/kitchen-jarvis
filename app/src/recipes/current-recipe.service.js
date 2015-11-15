/**
 * Created by diegob on 03.10.15.
 */

(function () {
  'use strict';

  angular.module('kjApp')
      .service('currentRecipeService', currentRecipeService);

  currentRecipeService.$inject = [];

  /* @ngInject */
  function currentRecipeService() {
    var svc = this;
    var recipe = null;

    svc.setRecipe = setRecipe;
    svc.getRecipe = getRecipe;
    svc.clearRecipe = clearRecipe;

    // ------------------------------------------------------------------------
    function setRecipe(newRecipe) {
      recipe = newRecipe;
    }

    function getRecipe() {
      return recipe;
    }

    function clearRecipe() {
      recipe = null;
    }
  }
})();
