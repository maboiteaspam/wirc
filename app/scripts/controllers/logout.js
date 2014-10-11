'use strict';

/**
 * @ngdoc function
 * @name wircApp.controller:LogoutCtrl
 * @description
 * # LogoutCtrl
 * Controller of the wircApp
 */
angular.module('wircApp')
  .controller('LogoutCtrl', function ($scope, $rootScope) {
    $scope.user = {
        logged:false
    };
    /* updates view */
    $rootScope.$on("user_login", function(ev, user, w){
        $scope.user = user;
        /* initializes logout click broadcast */
        $scope.logout = function(){
            $rootScope.$broadcast("user_logout", $scope.user, w)
        };
    });
    /* handles logout click */
    $rootScope.$on("user_logout", function(user, w){
        /* stop broadcasting */
        $scope.logout = function(){};
    });
    $scope.logout = function(){};

  });
