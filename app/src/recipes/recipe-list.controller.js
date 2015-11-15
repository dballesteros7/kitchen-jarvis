/**
 * Created by diegob on 03.10.15.
 */

(function () {
  'use strict';

  angular.module('kjApp')
      .controller('RecipeListController', RecipeListController);

  RecipeListController.$inject = ['recipeService', '$q'];

  /* @ngInject */
  function RecipeListController(recipeService, $q) {
    var vm = this;
    vm.recipes = [];
    vm.searchText = '';
    vm.recipesReady = false;
    vm.recipesEmpty = false;
    vm.selectedFilters = [];
    vm.filterSearchText = '';
    vm.attribution = '';

    vm.onSearchKeyUp = onSearchKeyUp;
    vm.getFilterMatches = getFilterMatches;
    vm.searchRecipes = searchRecipes;

    activate();

    // -------------------------------------------------------------------------
    function activate() {
      searchRecipes();
    }

    function searchRecipes() {
      vm.recipesReady = false;
      recipeService.searchRecipes(vm.searchText, vm.selectedFilters)
          .then(onRecipesResult)
          .catch(onError);
    }

    function onRecipesResult(recipeData) {
      vm.recipes = recipeData.matches.map(function(item) {
        item.smallImageUrls = item.smallImageUrls.map(function(url) {
          return url.replace('http://', 'https://');
        });
        return item;
      });
      vm.attribution = recipeData.attribution.html;
      vm.recipesReady = true;
      vm.recipesEmpty = vm.recipes.length === 0;
    }

    function onError() {
      vm.recipesEmpty = true;
      vm.recipesReady = true;
    }

    function onSearchKeyUp($event) {
      if ($event.keyCode === 13) {
        searchRecipes();
      }
    }

    function getFilterMatches() {
      return recipeService.getFilterMatches(vm.filterSearchText);
    }
  }
})();
