/**
 * Created by diegob on 03.10.15.
 */

(function () {
  'use strict';

  window.kj = window.kj || {};
  var kj = window.kj;

  kj.RecipeListController = function(recipes) {
    this.recipes = recipes;
  };

  kj.module.controller('RecipeListController', ['recipes', kj.RecipeListController]);
})();