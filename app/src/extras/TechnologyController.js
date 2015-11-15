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
      name: 'Google',
      detail: 'Built for Google Chrome',
      brandImg: 'assets/google.gif'
    }, {
      name: 'AngularJS',
      detail: 'AngularJS & Angular Material',
      brandImg: 'assets/angular.png'
    }, {
      name: 'Firebase',
      detail: 'Web Hosting',
      brandImg: 'assets/firebase.png'
    }, {
      name: 'Yummly',
      detail: 'Recipe provider',
      brandImg: 'assets/yummly.png'
    }
  ];

  kj.module.controller('TechnologyController', kj.TechnologyController);
})();
