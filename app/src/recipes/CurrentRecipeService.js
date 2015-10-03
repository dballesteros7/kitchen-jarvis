/**
 * Created by diegob on 03.10.15.
 */

(function () {
  'use strict';

  window.kj = window.kj || {};
  var kj = window.kj;

  kj.CurrentRecipeService = function ($window, $rootScope, $q, recipeService, voiceService) {
    this.localStorage_ = $window.localStorage;
    this.$rootScope_ = $rootScope;
    this.$q_ = $q;
    this.recipeService_ = recipeService;
    this.voiceService_ = voiceService;
    this.recipe = null;
    this.recipeStarted = null;

    this.$rootScope_.$on('speechResult', this.onResult.bind(this));
    this.loadRecipe_();
  };

  kj.CurrentRecipeService.RECIPE_KEY = 'currentRecipe';
  kj.CurrentRecipeService.RECIPE_STARTED_KEY = 'currentRecipeStarted';

  kj.CurrentRecipeService.prototype.loadRecipe_ = function () {
    var recipeId = this.localStorage_.getItem(kj.CurrentRecipeService.RECIPE_KEY);
    if (recipeId) {
      this.recipeStarted = this.localStorage_.getItem(kj.CurrentRecipeService.RECIPE_STARTED_KEY);
      return this.recipeService_.getRecipe(recipeId).then(function (recipe) {
        this.recipe = recipe;
      }.bind(this));
    }
    return this.$q_.when(this.recipe);
  };

  kj.CurrentRecipeService.prototype.setCurrentRecipe = function (recipe) {
    if (recipe) {
      this.recipe = recipe;
      this.recipeStarted = Date.now();
      this.localStorage_.setItem(kj.CurrentRecipeService.RECIPE_KEY, this.recipe.RecipeID);
      this.localStorage_.setItem(kj.CurrentRecipeService.RECIPE_STARTED_KEY, this.recipeStarted);
    } else {
      this.recipe = null;
      this.localStorage_.removeItem(kj.CurrentRecipeService.RECIPE_KEY);
      this.localStorage_.removeItem(kj.CurrentRecipeService.RECIPE_STARTED_KEY);
    }
  };

  kj.CurrentRecipeService.prototype.getCurrentRecipe = function () {
    if (this.recipe) {
      return this.$q_.when(this.recipe);
    }
    return this.loadRecipe_();
  };

  kj.CurrentRecipeService.prototype.onResult = function (event, detail) {
    if (event.defaultPrevented) {
      return;
    }
    console.log('onResult recipe enter ' + Date.now());
    var result = detail.text;
    console.log('Got a result');
    console.log(result);
    if (this.recipe) {
      this.recipeService_.sendVoiceQuery(this.recipe.RecipeID, result).then(function (response) {
        console.log(response);
        this.voiceService_.play(response, detail.voiceModel);
      }.bind(this)).catch(function () {
        if (detail.swear) {
          this.voiceService_.play('I did not understand shit. Speak fucking clear', detail.voiceModel);
        } else {
          this.voiceService_.play('Sorry, I did not understand that.', detail.voiceModel);
        }
      }.bind(this));
    } else {
      if (detail.swear) {
        this.voiceService_.play('Open a recipe first. Bugger off!', detail.voiceModel);
      } else {
        this.voiceService_.play('First you need to start a recipe.', detail.voiceModel);
      }

    }
    console.log('onResult recipe exit ' + Date.now());
  };

  kj.module.service('currentRecipeService', kj.CurrentRecipeService);
})();