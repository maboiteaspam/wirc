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
    $rootScope.$on('userLogin', function(ev, user, w){
        $scope.user = user;
        /* initializes logout click broadcast */
        $scope.logout = function(){
            $rootScope.$broadcast('userLogout', $scope.user, w);
        };
    });
    /* handles logout click */
    $rootScope.$on('userLogout', function( /* user, w */ ){
        /* stop broadcasting */
        $scope.logout = function(){};
    });
    $scope.logout = function(){};

  });
