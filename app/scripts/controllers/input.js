'use strict';

/**
 * @ngdoc function
 * @name wircApp.controller:InputCtrl
 * @description
 * # InputCtrl
 * Controller of the wircApp
 */
angular.module('wircApp')
  .controller('InputCtrl', function ($scope, $rootScope) {
    /* holds input value */
    $scope.new_message = {
        text:"Type message here"
    };
    /* broadcasts message when used press Send */
    $rootScope.$on("user_login", function(ev, user, w){
        $scope.sendMessage = function(){
            $rootScope.$broadcast("new_message", $scope.new_message.text, user, w );
        };
    });
    /* stop broadcasting */
    $rootScope.$on("user_logout", function(user, w){
        $scope.sendMessage = function(){};
    });
    /* check for Enter key to submit message */
    $scope.keyUpListener = function($event){
        if ($event.keyCode == 13) {
            $scope.sendMessage();
        }
    };
    $scope.sendMessage = function(){};
  });
