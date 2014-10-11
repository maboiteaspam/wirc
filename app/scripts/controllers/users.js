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
            name:'maboiteaspam'
        },
        {
            name:'ghis'
        }
    ];
    /* Updates user list */
    $scope.$on('userLogin',function($event, user, w){
        w.one('userList',function(data){
            $scope.$apply(function () {
                $scope.users = $scope.reject($scope.users, function(m){
                    return true;
                });
                for( var n in data.list ){
                    $scope.users.push({
                        name:data.list[n].userName
                    });
                }
            });
            w.on('userEnter',function(data){
                $scope.$apply(function () {
                    var newUser = {
                        name:data.userName
                    };
                    $scope.users.push(newUser);
                });
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

    /* stops broadcasting */
    $scope.$on('userLogout', function( /* user, w */ ){
        $scope.users = [];
    });
  });
