'use strict';

/**
 * @ngdoc function
 * @name wircApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the wircApp
 */
angular.module('wircApp')
  .controller('InputCtrl', function ($scope, $rootScope) {
    $scope.new_message = {
        text:"Type message here"
    };
    $scope.sendMessage = function(){};
    $rootScope.$on("user_login", function(user, w){
        $scope.sendMessage = function(){
            $rootScope.$broadcast("new_message", $scope.new_message );
        };
    });
    $rootScope.$on("user_logout", function(user, socket){
        $scope.sendMessage = function(){};
    });
    $scope.keyUpListener = function($event){
        /* check for Enter key */
        if ($event.keyCode == 13) {
            $scope.sendMessage();
        }
    };
  });
