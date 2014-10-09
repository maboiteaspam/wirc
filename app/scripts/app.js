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
        'duScroll',
        'angular-underscore'
    ])
    .service('websocket', function() {
        this.opened_cnt = 0;
        this.connected_cnt = 0;
        this.get = function(address){
            var that = this;
            var websocket = new WebSocket(address);
            websocket.onopen = function(evt){
                console.log("socket open")
                console.log(evt)
            };
            websocket.onclose = function(evt){
                console.log("socket close")
                console.log(evt)
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
    .service('wirc', function(websocket) {
        var sub = function(to,fn,one){
            if( one ){
                fn = (function(old_fn,to){
                    return function(res){
                        delete to[ to.indexOf(old_fn) ]
                        old_fn(res);
                    }
                })(fn,to);
            }
            to.push(fn);
        }
        this.get = function(address){
            return new function(){
                var that = this;
                that.socket = null;
                that.ons = [];
                that.oners = [];

                var parse_response = function(res){
                    res = JSON.parse(res.data);
                    for( var n in that.oners ){
                        that.oners[n](res)
                    }
                    for( var n in that.ons ){
                        that.ons[n](res)
                    }
                };
                this.open = function(then){
                    that.socket = websocket.get(address);
                    that.socket.onopen = function(evt){
                        that.socket.onmessage = function(res){
                            parse_response(res);
                        };
                        that.socket.onclose = function(){
                            parse_response({
                                data:JSON.stringify({
                                    message:"socket_close"
                                })
                            });
                        };
                        if(then) then();
                    };
                }
                this.onclose = function(then){
                    that.one("socket_close",then);
                }
                this.on = function(message,fn){
                    sub(that.ons,function(res){
                        if( res.message == message ){
                            fn(res)
                        }
                    },false);
                }
                this.one = function(message,fn){
                    sub(that.oners,function(res){
                        if( res.message == message ){
                            fn(res)
                        }
                    },true);
                }

                this.login = function(username){
                    that.socket.send(JSON.stringify({
                        message:'login',
                        username:username
                    }));
                }
                this.quit = function(username,token){
                    that.socket.send(JSON.stringify({
                        message:'bye',
                        username:username,
                        token:token
                    }));
                    try{
                        that.socket.close();
                    }catch(ex){}
                }
            };
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