'use strict';

/**
 * @ngdoc function
 * @name wircApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the wircApp
 */
angular.module('wircApp')
  .controller('LoginCtrl', function ($scope) {
    $scope.user = {
        logged:false
    };
    $scope.login = function(){
        /*
         setTimeout(function(){
         $scope.$apply(function () {
         $scope.user.logged = true;
         });
         },1500)
         */
        return false;
    };
  });
