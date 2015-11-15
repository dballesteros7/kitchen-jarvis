/**
 * Created by diegob on 03.10.15.
 */

(function () {
  'use strict';

  angular.module('kjApp')
      .controller('SidebarController', SidebarController);

  SidebarController.$inject = ['$mdSidenav', '$state', 'currentRecipeService'];

  /* @ngInject */
  function SidebarController($mdSidenav, $state, currentRecipeService) {
    var vm = this;

    vm.getCurrentRecipe = currentRecipeService.getRecipe;
    vm.navigateTo = navigateTo;
    vm.navigateToCurrentRecipe = navigateToCurrentRecipe;


    // -------------------------------------------------------------------------
    function navigateTo(state) {
      $state.go(state);
      $mdSidenav('left').toggle();
    }

    function navigateToCurrentRecipe() {
      $state.go('recipeView', {
        recipeId: vm.getCurrentRecipe().id
      });
      $mdSidenav('left').toggle();
    }
  }
})();
