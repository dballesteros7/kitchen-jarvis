/**
 * Created by diegob on 03.10.15.
 */

(function () {
  'use strict';

  window.kj = window.kj || {};
  var kj = window.kj;

  kj.RecipeController = function(recipe, currentRecipeService) {
    this.recipe = recipe;
    this.currentRecipeService_ = currentRecipeService;
  };


  kj.RecipeController.prototype.startRecipe = function() {
    this.currentRecipeService_.setCurrentRecipe(this.recipe);
  };

  kj.RecipeController.prototype.isStarted = function() {
    if (this.currentRecipeService_.recipe) {
      return this.currentRecipeService_.recipe.RecipeID === this.recipe.RecipeID;
    }
    return false;
  };

  kj.RecipeController.prototype.finishRecipe = function() {
    return this.currentRecipeService_.setCurrentRecipe(null);
  };

  kj.module.controller('RecipeController', kj.RecipeController);
})();