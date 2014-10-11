'use strict';
/*global _:false */
/*global $:false */

angular.module('uiHelpers', [
])
    /* Ensures vertical scroll displays bottom of a content */
    .directive('keepScrollDown', ['$window',function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var el = angular.element(element);
                /* listens to new child nodes event */
                el.on('DOMSubtreeModified', _.debounce(function(){
                    if (el[0].scrollHeight-el[0].offsetHeight - el.scrollTop() <= 50 ) {
                        /* scrolls to bottom */
                        el.scrollToAnimated(0, el[0].scrollHeight, 50);
                    }
                }, 50));
            }
        };
    }])
    /* Ensures an element covers full view port height */
    .directive('fullHeight', ['$window', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var el = angular.element(element);
                var resize = function(){
                    /* Takes care of element s padding/margin */
                    var value = $(window).height() - (el.outerHeight(true) - el.height());
                    el.css('height', value+'px');
                };
                /* Listens to resize events */
                $(window).resize(_.debounce(resize, 150));
                /* Sets initial size */
                resize();
            }
        };
    }])
    /* Ensures an element covers full view port width */
    .directive('fullWidth', ['$window', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var el = angular.element(element);
                var resize = function(){
                    /* Takes care of element s padding/margin */
                    var value = $(window).width() - (el.outerWidth(true) - el.width());
                    el.css('width', value+'px');
                };
                /* Listens to resize events */
                $(window).resize(_.debounce(resize, 150));
                /* Sets initial size */
                resize();
            }
        };
    }]);