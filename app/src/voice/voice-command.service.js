(function () {
  'use strict';

  angular.module('kjApp')
      .service('voiceCommandService', voiceCommandService);

  voiceCommandService.$inject = [
    'currentRecipeService', 'speechSynthesisService', '$window'];

  /* @ngInject */
  function voiceCommandService(currentRecipeService, speechSynthesisService,
      $window) {
    var svc = this;

    svc.process = process;

    // -------------------------------------------------------------------------

    function process(command, onEnd) {
      command = command.toLowerCase();
      var recipe = currentRecipeService.getRecipe();

      // Check for how much/how many queries.
      var quantityQry = command.indexOf('how much ');
      var altQuantityQry = command.indexOf('how many ');
      if (quantityQry !== -1 || altQuantityQry !== -1) {
        quantityQry = quantityQry !== -1 ? quantityQry : altQuantityQry;
        var queryStart = quantityQry + 9;
        var queryRemainder = command.substring(queryStart);
        var match = recipe.ingredientLines.filter(function(ingredientLine) {
          return ingredientLine.toLowerCase().indexOf(queryRemainder) !== -1;
        });
        if (match.length > 0) {
          speechSynthesisService.speak(match[0], onEnd);
        } else {
          speechSynthesisService.speak(
              'No ' + queryRemainder + ' in the recipe.', onEnd);
        }
        return;
      }

      // Check for open the instructions command.
      var openQry = command.indexOf('open instructions');
      if (openQry !== -1) {
        speechSynthesisService.speak('Opening recipe instructions.',
            openingOnEnd);
        return;
      }

      speechSynthesisService.speak(
          'Sorry. I did not recognize the command.', onEnd);

      function openingOnEnd() {
        onEnd();
        var window = $window.open(recipe.source.sourceRecipeUrl, '_blank');
        if (window) {
          window.focus();
        }
      }
    }
  }
})();
