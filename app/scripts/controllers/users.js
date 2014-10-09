'use strict';

/**
 * @ngdoc function
 * @name wircApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the wircApp
 */
angular.module('wircApp')
  .controller('UsersCtrl', function ($scope) {
    $scope.users = [
        {
            name:'maboiteaspam'
        },
        {
            name:'ghis'
        }
    ];
    /* when an user connect
    WebSocket.onmessage(function(event) {
        if( event.message == "connect" ){
            console.log('message: ', event.data);
        }
    });*/
    /* when an user disconnect
    WebSocket.onmessage(function(event) {
        if( event.message == "disconnect" ){
            console.log('message: ', event.data);
        }
    });*/
  });
