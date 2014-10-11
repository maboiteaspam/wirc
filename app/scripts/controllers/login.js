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
    /* users that has login */
    $scope.user = {
        logged:false,
        username:"",
        token:""
    };
    /* holds input value */
    $scope.input = {
        logged:false,
        remember_me:false,
        server_address:"ws://localhost:8080/",
        username:"tomate"
    };
    /* log in user on server */
    $scope.login = function(){
        /* opens socket to server */
        var w = wirc.get($scope.input.server_address);
        w.open(function(){
            w.one("login_success",function(res){
                $scope.$apply(function () {
                    /* saves successful login, updates view */
                    $scope.user.logged = $scope.input.logged = true;
                    $scope.user.username = $scope.input.username;
                    $scope.user.token = res.token;
                    /* informs other components */
                    $rootScope.$broadcast("user_login", $scope.user, w );
                });
                /* logout on server disconnect */
                w.onclose(function(){
                    $scope.$apply(function () {
                        $rootScope.$broadcast("user_logout", $scope.user, null);
                        w=null;
                    });
                });
            },true);
            /* realize the login sequence */
            w.login($scope.input.username);
        });
    };
    $rootScope.$on("user_logout", function(ev, user, w){
        /* saves logout, updates view */
        $scope.user.logged = $scope.input.logged = user.logged = false;
        $scope.user.username = user.username = "";
        $scope.user.token = user.token = "";
        /* disconnects from the socket */
        if(w) w.quit(user.username, user.token);
        w=null;
    })

  });
