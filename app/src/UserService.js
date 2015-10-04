/**
 * Created by diegob on 04.10.15.
 */

(function () {
  'use strict';

  window.kj = window.kj || {};
  var kj = window.kj;

  kj.UserService = function(firebase, $firebaseAuth) {
    var ref = new Firebase(firebase);
    this.auth = $firebaseAuth(ref);

    this.currentUser = this.auth.$getAuth();

    this.auth.$onAuth(this.onAuthChange, this);
  };

  kj.UserService.prototype.loginWithGoogle = function() {
    this.auth.$authWithOAuthPopup('google')
        .then(this.onAuthChange.bind(this));
  };

  kj.UserService.prototype.onAuthChange = function(userData) {
    this.currentUser = userData;
  };

  kj.UserService.prototype.signOut = function() {
    this.auth.$unauth();
  };


  kj.module.service('userService', kj.UserService);
})();