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
    templateUrl: 'src/recipes/views/recipe-list.html',
    controller: 'RecipeListController',
    controllerAs: 'vm'
  };
  kj.states.recipeView = {
    name: 'recipeView',
    url: '/recipes/:recipeId',
    templateUrl: 'src/recipes/views/recipe-details.html',
    controller: 'RecipeDetailsController',
    controllerAs: 'vm'
  };
  kj.states.teamView = {
    name: 'teamView',
    url: '/team',
    templateUrl: 'src/extras/team.html'
  };
  kj.states.technologyView = {
    name: 'technologyView',
    url: '/stack',
    templateUrl: 'src/extras/technology.html',
    controller: 'TechnologyController',
    controllerAs: 'ctrl'
  };

  kj.module.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/recipes');
    $stateProvider.state(kj.states.recipeList);
    $stateProvider.state(kj.states.recipeView);
    $stateProvider.state(kj.states.teamView);
    $stateProvider.state(kj.states.technologyView);
  });
})();
