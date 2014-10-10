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
    /* those are messages exchanged and broadcasted by users */
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
    /* those are messages typed in by current user but not yet broadcasted to all users */
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
        var user_message = {
            text:message,
            username:user.username,
            message_date:moment().valueOf(),
            id: $scope.message_id
        };
        $scope.message_id++;
        $scope.local_messages.push(user_message);
        /* now broadcast to other users via central server */
        w.send_message(user_message.username,user_message.text,user_message.id,user_message.message_date,user.token);
    })
    /* when server emits a message */
    $scope.$on("user_login",function($event, user, w){
        w.on("message_sent",function(evt){
            $scope.$apply(function () {
                var message = evt.user_message;
                if( message.username == user.username ){
                    $scope.local_messages = $scope.reject($scope.local_messages, function(m){
                        return m.id == message.message_id;
                    })
                }
                var user_message = {
                    text:message.user_message,
                    username:message.username,
                    message_date:message.message_date,
                    id: message.message_id
                };
                $scope.messages.push(user_message);
            });
        })
    });
  });
