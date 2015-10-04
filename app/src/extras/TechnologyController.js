/**
 * Created by diegob on 04.10.15.
 */

(function () {
  'use strict';

  window.kj = window.kj || {};
  var kj = window.kj;

  kj.TechnologyController = function() {
    this.products = kj.TechnologyController.PRODUCTS;
  };

  kj.TechnologyController.PRODUCTS = [
    {
      name: 'IBM Watson',
      detail: 'Text to Speech API',
      brandImg: 'assets/watson.png'
    }, {
      name: 'Microsoft Azure',
      detail: 'Application hosting',
      brandImg: 'assets/azure.png'
    }, {
      name: 'Google',
      detail: 'Built for Google Chrome',
      brandImg: 'assets/google.gif'
    }, {
      name: 'Particle',
      detail: 'Photon platform',
      brandImg: 'assets/particle.png'
    }, {
      name: 'AngularJS',
      detail: 'AngularJS & Angular Material',
      brandImg: 'assets/angular.png'
    }, {
      name: 'Firebase',
      detail: 'Web Hosting',
      brandImg: 'assets/firebase.png'
    }, {
      name: 'BigOven',
      detail: 'Recipe catalog',
      brandImg: 'assets/bigoven.png'
    }, {
      name: 'Flask',
      detail: 'Application server',
      brandImg: 'assets/flask.png'
    }, {
      name: 'HTML5',
      detail: 'Speech Recognition & Web Audio APIs',
      brandImg: 'assets/html5.png'
    }
  ];



  kj.module.controller('TechnologyController', kj.TechnologyController);
})();