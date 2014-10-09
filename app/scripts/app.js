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
    .run(function($rootScope){
        $rootScope.tomate = "sdfsdfsdf"
    })
;