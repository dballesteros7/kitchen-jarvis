/**
 * Created by diegob on 03.10.15.
 */

(function () {
  'use strict';

  angular.module('kjApp')
      .factory('recipeService', recipeService);

  recipeService.$inject = ['$http', '$q', '$window',
    '$filter', 'yummlyCredentials'];

  /* @ngInject */
  function recipeService($http, $q, $window, $filter, yummlyCredentials) {
    var api = {
      searchRecipes: searchRecipes,
      getFilterMatches: getFilterMatches
    };

    var backend = 'https://api.yummly.com/v1/api';
    var headers = {
      'X-Yummly-App-ID': yummlyCredentials.applicationId,
      'X-Yummly-App-Key': yummlyCredentials.applicationKey
    };

    var searchableMetadata = [];

    activate();

    return api;

    // -------------------------------------------------------------------------

    function activate() {
      populateFilterDictionaries();
    }

    function searchRecipes(query, selectedFilters) {
      function getSearchValue(item) {
        return item.searchValue;
      }
      function getTypeFilter(type) {
        return function(item) {
          return item.type === type;
        };
      }
      var allergies = selectedFilters
          .filter(getTypeFilter('allergy'))
          .map(getSearchValue);
      var courses = selectedFilters
          .filter(getTypeFilter('course'))
          .map(getSearchValue);
      var diets = selectedFilters
          .filter(getTypeFilter('diet'))
          .map(getSearchValue);
      var cuisines = selectedFilters
          .filter(getTypeFilter('cuisine'))
          .map(getSearchValue);
      var holidays = selectedFilters
          .filter(getTypeFilter('holiday'))
          .map(getSearchValue);
      var params = {
        requirePictures: true,
        q: query,
        maxResult: 24,
        'allowedAllergy[]': allergies,
        'allowedDiet[]': diets,
        'allowedCuisine[]': cuisines,
        'allowedCourse[]': courses,
        'allowedHoliday[]': holidays
      };

      return $http({
        url: backend + '/recipes',
        params: params,
        headers: headers
      }).then(function(httpData) {
        return httpData.data;
      });
    }

    function populateFilterDictionaries() {
      $window.set_metadata = setMetadata;
      var queryParams = {
        _app_id: yummlyCredentials.applicationId,
        _app_key: yummlyCredentials.applicationKey
      };
      var allergyPromise = $http.jsonp(backend + '/metadata/allergy', {
          params: queryParams
        });
      var dietPromise = $http.jsonp(backend + '/metadata/diet', {
        params: queryParams
      });
      var cuisinePromise = $http.jsonp(backend + '/metadata/cuisine', {
        params: queryParams
      });
      var coursePromise = $http.jsonp(backend + '/metadata/course', {
        params: queryParams
      });
      var holidayPromise = $http.jsonp(backend + '/metadata/holiday', {
        params: queryParams
      });
      return $q.all([
        allergyPromise, dietPromise, cuisinePromise,
        coursePromise, holidayPromise]);
    }

    function setMetadata(label, data) {
      Array.prototype.push.apply(searchableMetadata, data.map(function(item) {
        item.description = item.description ||
            item.longDescription || item.shortDescription;
        return item;
      }));
    }

    function getFilterMatches(searchText) {
      var result = $filter('filter')(searchableMetadata, {
        description: searchText
      });
      return result;
    }
  }
})();
