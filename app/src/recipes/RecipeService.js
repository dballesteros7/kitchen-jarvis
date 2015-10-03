/**
 * Created by diegob on 03.10.15.
 */

(function () {
  'use strict';

  window.kj = window.kj || {};
  var kj = window.kj;

  kj.RecipeService = function($q, $http, backend) {
    this.$q_ = $q;
    this.$http_ = $http;
    this.backend = backend;
  };

  kj.RecipeService.prototype.getRecipeList = function() {
    return this.$http_({
      url: this.backend + '/recipes/api/v1.0/recipes',
      method: 'GET'
    }).then(function(response) {
      return response.data.response;
    }).catch(function(error) {
      console.log(error);
      return [];
    });
  };

  kj.RecipeService.prototype.sendVoiceQuery = function(recipeId, query) {
    return this.$http_({
      url: this.backend + '/recipes/api/v1.0/ask?' + 'recipe_id=' + encodeURIComponent(recipeId) + '&text=' + encodeURIComponent(query),
      method: 'GET'
    }).then(function(response) {
      return response.data.response;
    }.bind(this)).catch(function(error) {
      console.log(error);
      return this.$q_.reject(error);
    }.bind(this))
  };

  kj.RecipeService.prototype.getRecipe = function(id) {
    return this.$http_({
      url: this.backend + '/recipes/api/v1.0/recipe_info',
      params: {
        'recipe_id': id
      },
      method: 'GET'
    }).then(function(response){
      return response.data.response;
    });
  };

  kj.module.service('recipeService', ['$q', '$http', 'backend', kj.RecipeService]);
})();