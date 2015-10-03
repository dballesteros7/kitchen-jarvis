/**
 * Created by diegob on 03.10.15.
 */


(function () {
  'use strict';

  window.kj = window.kj || {};
  var kj = window.kj;

  kj.TemperatureService = function($http, $rootScope, $mdDialog, backend) {
    this.$http_ = $http;
    this.backend_ = backend;
    this.$rootScope_ = $rootScope;
    this.$mdDialog_ = $mdDialog;
    this.$rootScope_.$on('speechResult', this.onResult.bind(this));
  };

  kj.TemperatureService.prototype.getLatestMeasurements = function() {
    return this.$http_({
      url: this.backend_ + '/get_temp_list',
      method: 'GET'
    }).then(function(response){
      var timeAndMeasurement = response.data.response;
      var result = [];
      for(var i = 0; i < timeAndMeasurement.temp_list.length; i++) {
        result.push({
          date: new Date(parseFloat(timeAndMeasurement.ts_list[i]) * 1000),
          temperature: parseFloat(timeAndMeasurement.temp_list[i])
        });
      }
      return result.reverse();
    }).catch(function(response) {
      return [];
    });
  };

  kj.TemperatureService.prototype.onResult = function(event, detail) {
    var text = detail.text;
    if (text.toLowerCase().trim() === 'is the oven ready') {
      event.preventDefault();
      this.$mdDialog_.show({
        controller: 'TemperatureDialogController as ctrl',
        templateUrl: 'src/graph-dialog.html',
        parent: angular.element(document.body),
        clickOutsideToClose:true,
        locals: {
          voiceModel: detail.voiceModel
        }
      });
    }
  };

  kj.TemperatureDialogController = function($mdDialog, $window, voiceModel) {
    $window.setTimeout(function() {
      $mdDialog.hide();
    }, 30000);
    this.voiceModel = voiceModel;
    this.upperLimit = 20;
  };

  kj.module.service('temperatureService', kj.TemperatureService);
  kj.module.controller('TemperatureDialogController', kj.TemperatureDialogController);
})();