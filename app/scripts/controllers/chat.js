'use strict';

/**
 * @ngdoc function
 * @name wircApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the wircApp
 */
angular.module('wircApp')
  .controller('ChatCtrl', function ($scope) {
    /* those are messages exchanged and broadcasted by users */
    $scope.messages = [
        {
            username:'',
            text:'hello !'
        }
    ];
    /* those are messages typed in by current user but not yet broadcasted to all users */
    $scope.local_messages = [
        {
            username:'',
            text:'hello !'
        }
    ];
    /* when user sends a message */
    $scope.$on("new_message",function($event,message){
        $scope.local_messages.push({
            text:message.text
        })
        /* scroll down on new message only if the scroll bar is already at bottom */
        var el = angular.element(".chat");
        if (el[0].offsetHeight + el.scrollTop() >= el[0].scrollHeight) {
            el.scrollToElementAnimated(el.find("li").last());
        }
    })
    /* when new messages income
    WebSocket.onmessage(function(event) {
        if( event.message == "new_message" ){
            console.log('message: ', event.data);
        }
    });*/
  });
