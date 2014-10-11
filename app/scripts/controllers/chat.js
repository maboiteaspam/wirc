'use strict';

/**
 * @ngdoc function
 * @name wircApp.controller:ChatCtrl
 * @description
 * # ChatCtrl
 * Controller of the wircApp
 */
angular.module('wircApp')
  .controller('ChatCtrl', function ($scope, moment) {
    /* shared stack of messages exchanged by the server */
    $scope.messages = [
        /*
         {
         userName:'xxx',
         text:'hello !',
         message_date:1,
         id:0
         }
         */
    ];
    /* stack of local messages for immediate display */
    $scope.localMessages = [
        /*
         {
         userName:'yyyy',
         text:'hello !',
         message_date:1,
         id:1
         }
         */
    ];
    /* Displays entered message immediately */
    $scope.$on('newMessage',function($event, userMessage, user, w){
        $scope.localMessages.push(userMessage);
    });
    /* Listens server message broadcast once user is logged in */
    $scope.$on('userLogin',function($event, user, w){
        w.on('messageSent',function(data){
            $scope.$apply(function () {
                var message = data.userMessage;
                /* needs to move the message from local immediate stack to shared stack */
                if( message.userName === user.userName ){
                    $scope.localMessages = $scope.reject($scope.localMessages, function(m){
                        return m.id === message.messageId;
                    });
                }
                /* forge a message structure */
                var userMessage = {
                    text:message.userMessage,
                    userName:message.userName,
                    messageDate:message.messageDate,
                    id: message.messageId
                };
                /* push into the shared message stack */
                $scope.messages.push(userMessage);
            });
        });
    });
    /* Cleans interface when user disconnected */
    $scope.$on('userLogout', function( /* user, w */ ){
        $scope.messages = [];
        $scope.localMessages = [];
    });
  });
