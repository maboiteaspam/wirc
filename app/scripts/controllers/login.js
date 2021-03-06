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
    /* users logged in the app */
    $scope.user = {
        logged:false,
        userName:'',
        token:''
    };
    /* holds view input value */
    $scope.input = {
        logged:false,
        rememberMe:false,
        serverAddress:'ws://localhost:8080/',
        userName:'tomate'
    };
    /* log in user on server */
    $scope.login = function(){
        /* opens socket to server */
        var w = wirc.get($scope.input.serverAddress);
        w.open(function(){
            /* waits for login to initialize ui to socket communication */
            w.one('loginSuccess',function(res){
                $scope.$apply(function () {
                    /* applies successful login */
                    $scope.user.logged = $scope.input.logged = true;
                    $scope.user.userName = $scope.input.userName;
                    $scope.user.token = res.token;
                    /* informs other components */
                    $rootScope.$broadcast('userLogin', $scope.user, w );
                });
                /* logout on server disconnect */
                w.onclose(function(){
                    $scope.$apply(function () {
                        $rootScope.$broadcast('userLogout', $scope.user, null);
                        w=null;
                    });
                });
            },true);
            /* realize the login sequence */
            w.login($scope.input.userName, true);
        });
    };
    /* applies logout */
    $rootScope.$on('userLogout', function(ev, user, w){
        /* disconnects from the socket */
        if(w){
            w.quit($scope.user.userName, $scope.user.token);
        }
        $scope.user.logged = $scope.input.logged = false;
        $scope.user.userName = '';
        $scope.user.token = '';
    });

  });
