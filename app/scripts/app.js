'use strict';

/**
 * @ngdoc overview
 * @name wircApp
 * @description
 * # wircApp
 *
 * Main module of the application.
 */
angular
    .module('wircApp', [
        'duScroll'
    ])
    .service('websocket', function() {
        this.opened_cnt = 0;
        this.connected_cnt = 0;
        this.get = function(address){
            var that = this;
            var websocket = new WebSocket(address);
            websocket.onopen = function(evt){
                that.connected_cnt++;
            };
            websocket.onclose = function(evt){
                that.connected_cnt--;
                that.opened_cnt--;
            };
            websocket.onmessage = function(evt){
                console.log("socket message")
                console.log(evt)
            };
            websocket.onerror = function(evt){
                console.log("socket error")
                console.log(evt)
            };
            this.opened_cnt++;
            return websocket;
        }
    })
    .directive('fullHeight', ['$timeout','$window',function (debounce,$interval,$window) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var el = angular.element(element);
                scope.$watch(function(){
                    return window.innerHeight;
                }, function(value) {
                    el.css("height", value+"px");
                },250);
            }
        };
    }])
    .directive('fullWidth', ['$timeout','$window',function (debounce,$interval,$window) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var el = angular.element(element);
                scope.$watch(function(){
                    return window.innerWidth;
                }, function(value) {
                    el.css("width", value+"px");
                },250);
            }
        };
    }])
    /*
     .run(function($rootScope){
     $rootScope.tomate = "sdfsdfsdf"
     })
     */
;