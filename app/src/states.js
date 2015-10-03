/**
 * Created by diegob on 03.10.15.
 */
(function () {
  'use strict';

  window.kj = window.kj || {};
  var kj = window.kj;

  kj.states = {};
  kj.states.recipeList = {
    name: 'recipeList',
    url: '/recipes',
    templateUrl: 'src/recipes/views/recipes.html',
    controller: 'RecipeListController',
    controllerAs: 'ctrl',
    resolve: {
      recipes: ['recipeService', function(recipeService) {
        return recipeService.getRecipeList();
      }]
    }
  };
  kj.states.recipeView = {
    name: 'recipeView',
    url: '/recipes/:recipeId',
    templateUrl: 'src/recipes/views/recipe.html',
    controller: 'RecipeController',
    controllerAs: 'ctrl',
    resolve: {
      recipe: ['recipeService', '$stateParams', function(recipeService, $stateParams) {
        return recipeService.getRecipe($stateParams.recipeId);
      }]
    }
  };

  kj.module.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/recipes');
    $stateProvider.state(kj.states.recipeList);
    $stateProvider.state(kj.states.recipeView);
  });
})();