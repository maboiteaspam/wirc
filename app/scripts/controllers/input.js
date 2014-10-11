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
    $scope.newMessage = {
        text:'Type message here'
    };
    /* broadcasts message when used press Send */
    $rootScope.$on('userLogin', function(ev, user, w){
        $scope.sendMessage = function(){
            $rootScope.$broadcast('newMessage', $scope.newMessage.text, user, w );
        };
    });
    /* stop broadcasting */
    $rootScope.$on('userLogout', function( /* user, w */ ){
        $scope.sendMessage = function(){};
    });
    /* check for Enter key to submit message */
    $scope.keyUpListener = function($event){
        if ($event.keyCode === 13) {
            $scope.sendMessage();
        }
    };
    $scope.sendMessage = function(){};
  });
