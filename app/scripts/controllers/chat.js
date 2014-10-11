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
         username:'xxx',
         text:'hello !',
         message_date:1,
         id:0
         }
         */
    ];
    /* stack of local messages for immediate display */
    $scope.local_messages = [
        /*
         {
         username:'yyyy',
         text:'hello !',
         message_date:1,
         id:1
         }
         */
    ];
    $scope.message_id = 0;
    /* when user sends a message */
    $scope.$on("new_message",function($event, message, user, w){
        /* forge a message structure */
        var user_message = {
            text:message,
            username:user.username,
            message_date:moment().valueOf(),
            id: $scope.message_id
        };
        $scope.message_id++;
        /* stacks it for immediate display */
        $scope.local_messages.push(user_message);
        /* now broadcast to other users via central server */
        w.send_message(user_message.username,user_message.text,user_message.id,user_message.message_date,user.token);
    })
    /* when server emits a message */
    $scope.$on("user_login",function($event, user, w){
        w.on("message_sent",function(evt){
            $scope.$apply(function () {
                var message = evt.user_message;
                /* needs to move the message from local immediate stack to shared stack */
                if( message.username == user.username ){
                    $scope.local_messages = $scope.reject($scope.local_messages, function(m){
                        return m.id == message.message_id;
                    })
                }
                /* forge a message structure */
                var user_message = {
                    text:message.user_message,
                    username:message.username,
                    message_date:message.message_date,
                    id: message.message_id
                };
                /* push into the shared message stack */
                $scope.messages.push(user_message);
            });
        })
    });
    $scope.$on("user_logout", function(user, socket){
        $scope.messages = [];
        $scope.local_messages = [];
    });
  });
