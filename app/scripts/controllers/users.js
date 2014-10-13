'use strict';
/*global _:false */

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
            allowWebCam:false,
            is_cam_enabled:false
        },
        {
            name:'ghis',
            is_current_user:false,
            allowWebCam:false,
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
                        allowWebCam:data.list[n].allowWebCam,
                        is_current_user:user.userName==data.list[n].userName
                    });
                }
            });
            w.on('userEnter',function(data){
                $scope.$apply(function () {
                    var newUser = {
                        name:data.userName,
                        allowWebCam:data.allowWebCam,
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
            w.on('serverEndSendPicture',function(data){
                for(var n in $scope.users ){
                    if( $scope.users[n].name == data.fromUserName ){
                        $scope.$apply(function () {
                            $scope.users[n].is_cam_enabled = false;
                        });
                        break;
                    }
                }
            });
        });
        $scope.requestCam = function(userNameRequestedCam){
            /*  */
            for(var n in $scope.users ){
                if( $scope.users[n].name == userNameRequestedCam ){
                    if( $scope.users[n].is_cam_enabled ){
                        w.unSubCam(
                            user.userName,
                            userNameRequestedCam,
                            user.token);
                    }else{
                        w.subCam(
                            user.userName,
                            userNameRequestedCam,
                            user.token);
                        w.one('serverSendPicture',function(data){
                            if( data.fromUserName == userNameRequestedCam ){
                                for(var nn in $scope.users ){
                                    if( $scope.users[nn].name == data.fromUserName ){
                                        $scope.$apply(function () {
                                            $scope.users[nn].is_cam_enabled = true;
                                        });
                                        break;
                                    }
                                }
                            }
                        });
                    }
                    break;
                }
            }
        };
    });

    $scope.requestCam = function(){};
    /*  */
    $scope.$on('userLogout', function( /* user, w */ ){
        $scope.users = [];
        $scope.requestCam = function(){};
    });
  });
