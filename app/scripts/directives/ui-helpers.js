'use strict';
/*global _:false */

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
;