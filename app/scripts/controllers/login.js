'use strict';

/**
 * @ngdoc function
 * @name wircApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the wircApp
 */
angular.module('wircApp')
  .controller('LoginCtrl', function ($scope, $rootScope, wirc) {
    $scope.user = {
        logged:false,
        username:"",
        token:""
    };
    $scope.input = {
        logged:false,
        remember_me:false,
        server_address:"ws://localhost:8080/",
        username:"tomate"
    };
    $scope.login = function(){
        var w = wirc.get($scope.input.server_address);
        w.open(function(){
            w.one("login_success",function(res){
                $scope.$apply(function () {
                    $scope.user.logged = $scope.input.logged = true;
                    $scope.user.username = $scope.input.username;
                    $scope.user.token = res.token;
                    $rootScope.$broadcast("user_login", $scope.user, w );
                });
                w.onclose(function(){
                    $scope.$apply(function () {
                        $rootScope.$broadcast("user_logout", $scope.user, w, true)
                    });
                });
            },true);
            w.login($scope.input.username);
        });
    };
    $rootScope.$on("user_logout", function(ev, user, w, has_disconnected){
        $scope.user.logged = $scope.input.logged = user.logged = false;
        $scope.user.username = user.username = "";
        $scope.user.token = user.token = "";
        if(!has_disconnected) w.quit(user.username, user.token)
    })

  });
