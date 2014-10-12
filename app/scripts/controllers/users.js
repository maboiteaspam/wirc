'use strict';

/**
 * @ngdoc function
 * @name wircApp.controller:UsersCtrl
 * @description
 * # UsersCtrl
 * Controller of the wircApp
 */
angular.module('wircApp')
  .controller('UsersCtrl', function ($scope) {
    $scope.users = [
        {
            name:'maboiteaspam',
            is_current_user:false,
            allow_cam:false,
            is_cam_enabled:false
        },
        {
            name:'ghis',
            is_current_user:false,
            allow_cam:false,
            is_cam_enabled:false
        }
    ];
    /* Updates user list */
    $scope.$on('userLogin',function($event, user, w){
        w.one('userList',function(data){
            $scope.$apply(function () {
                $scope.users = [];
                for( var n in data.list ){
                    $scope.users.push({
                        name:data.list[n].userName,
                        is_current_user:user.userName==data.list[n].userName
                    });
                }
            });
            w.on('userEnter',function(data){
                $scope.$apply(function () {
                    var newUser = {
                        name:data.userName,
                        is_current_user:user.userName==data.userName
                    };
                    $scope.users.push(newUser);
                });
            });
            w.on('userLeave',function(data){
                $scope.$apply(function () {
                    $scope.users = $scope.reject($scope.users, function(u){
                        return u.name === data.userName;
                    });
                });
            });
        });
        w.one('serverRequestCam',function(data){
            console.log("dsfsf")
        });
        $scope.requestCam = function(userNameRequestedCam){
            /* broadcasts to other users via central server */
            w.requestCam(
                user.userName,
                userNameRequestedCam,
                user.token);
        };
    });

    $scope.requestCam = function(){};
    /* stops broadcasting */
    $scope.$on('userLogout', function( /* user, w */ ){
        $scope.users = [];
        $scope.requestCam = function(){};
    });
  });
