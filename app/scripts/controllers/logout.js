'use strict';

/**
 * @ngdoc function
 * @name wircApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the wircApp
 */
angular.module('wircApp')
  .controller('LogoutCtrl', function ($scope, $rootScope) {
    $scope.user = {
        logged:false,
        username:""
    };

    $scope.logout = function(){};
    $rootScope.$on("user_login", function(ev, user, w){
        $scope.user = user;
        $scope.logout = function(){
            $rootScope.$broadcast("user_logout", $scope.user, w)
        };
    });
    $rootScope.$on("user_logout", function(user, w){
        $scope.logout = function(){};
    });

  });
