'use strict';

/**
 * @ngdoc function
 * @name wircApp.controller:InputCtrl
 * @description
 * # InputCtrl
 * Controller of the wircApp
 */
angular.module('wircApp')
  .controller('InputCtrl', function ($scope, $rootScope, moment) {
    /* holds input value */
    $scope.newMessage = {
        text:'Type message here'
    };
    /* holds count of messages sent */
    $scope.messageId = 0;
    /* broadcasts message when used press 'Send' */
    $rootScope.$on('userLogin', function(ev, user, w){
        $scope.sendMessage = function(){

            /* forges a message structure */
            var userMessage = {
                text:$scope.newMessage.text,
                userName:user.userName,
                messageDate:moment().valueOf(),
                id: $scope.messageId
            };
            $scope.messageId++;

            /* broadcasts to other users via central server */
            w.sendMessage(
                userMessage.userName,
                userMessage.text,
                userMessage.id,
                userMessage.messageDate,
                user.token);
            $rootScope.$broadcast('newMessage', userMessage, user, w );

        };
    });
    /* stops broadcasting */
    $rootScope.$on('userLogout', function( /* user, w */ ){
        $scope.sendMessage = function(){};
    });
    /* checks for Enter key to submit message */
    $scope.keyUpListener = function($event){
        if ($event.keyCode === 13) {
            $scope.sendMessage();
        }
    };
    $scope.sendMessage = function(){};
  });
