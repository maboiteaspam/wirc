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
    $scope.new_message = {
        text:"Type message here"
    };
    $scope.sendMessage = function(){};
    $rootScope.$on("user_login", function(ev, user, w){
        $scope.sendMessage = function(){
            $rootScope.$broadcast("new_message", $scope.new_message.text, user, w );
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
