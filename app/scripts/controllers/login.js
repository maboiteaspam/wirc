'use strict';

/**
 * @ngdoc function
 * @name wircApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the wircApp
 */
angular.module('wircApp')
  .controller('LoginCtrl', function ($scope, $rootScope, websocket) {
    $scope.user = {
        logged:false,
        username:""
    };
    $scope.input = {
        logged:false,
        remember_me:false,
        server_address:"ws://localhost:8080/",
        username:"tomate"
    };
    $scope.login = function(){
        var socket = websocket.get($scope.input.server_address);
        socket.onopen = function(evt){
            socket.onmessage = function(res){
                res = JSON.parse(res.data);
                if( res.message == "login_success" ){
                    $scope.$apply(function () {
                        $scope.user.logged = $scope.input.logged = true;
                        $scope.user.username = $scope.input.username;
                        $rootScope.$broadcast("user_login", $scope.user, socket );
                    });
                }else if( res.message == "login_failure" ){
                    $rootScope.$broadcast("user_logout", $scope.user, socket );
                    socket.send(JSON.stringify({
                        message:'bye',
                        username:$scope.input.username
                    }));
                    try{
                        socket.close();
                    }catch(ex){}
                }
            };
            socket.send(JSON.stringify({
                message:'login',
                username:$scope.input.username
            }));
        };
        return false;
    };

  });
