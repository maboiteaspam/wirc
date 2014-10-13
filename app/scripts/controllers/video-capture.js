'use strict';

/**
 * @ngdoc function
 * @name wircApp.controller:ChatCtrl
 * @description
 * # ChatCtrl
 * Controller of the wircApp
 */
angular.module('wircApp')
  .controller('VideoCaptureCtrl', function (webCamFeed, $scope) {

    /*  */
    $scope.picure = null;
    /*  */
    $scope.$on('userLogin',function($event, user, w){
        w.on('serverRequestCam',function(data){
            $scope.$apply(function () {
                webCamFeed.is_open = true;
            });
        });
        w.on('serverStopCam',function(data){
            $scope.$apply(function () {
                webCamFeed.is_open = false;
            });
        });
        $scope.$watch(function(){
            return webCamFeed.picture;
        },function(newValue){
            if( webCamFeed.is_open ){
                w.sendCamPicture(user.userName,newValue,user.token);
            }
        });
    });
    /*  */
    $scope.$on('userLogout', function( /* user, w */ ){
        webCamFeed.is_open = false;
    });
  });
