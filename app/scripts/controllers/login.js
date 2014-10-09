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
        username:""
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
            w.one("login_success",function(){
                $scope.$apply(function () {
                    $scope.user.logged = $scope.input.logged = true;
                    $scope.user.username = $scope.input.username;
                    $rootScope.$broadcast("user_login", $scope.user, w );
                });
            },true);
            w.one("login_failure",function(){
                $scope.$apply(function () {
                    $rootScope.$broadcast("user_logout", $scope.user, w );
                });
            },true);
            w.login($scope.input.username);
        });
    };
    $rootScope.$on("user_logout", function(ev, user, w){
        $scope.user.logged = $scope.input.logged = false;
        w.quit($scope.input.username)
    })

  });
