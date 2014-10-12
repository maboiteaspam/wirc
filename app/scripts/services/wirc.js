'use strict';

angular.module('wirc', [
])
    /* Provides websocket access within angularJS  */
    .service('websocket', function() {
        this.get = function(address){
            var websocket = new WebSocket(address);
            websocket.onopen = function(evt){
                console.log('socket open');
                console.log(evt);
            };
            websocket.onclose = function(evt){
                console.log('socket close');
                console.log(evt);
            };
            websocket.onmessage = function(evt){
                console.log('socket message');
                console.log(evt);
            };
            websocket.onerror = function(evt){
                console.log('socket error');
                console.log(evt);
            };
            return websocket;
        };
    })
    /* Implements event driven webocket consumption (it s a stream..) */
    /* Implements convenient methods to consume wirc server */
    .service('wirc', function(websocket) {
        var sub = function(to,fn,one){
            if( one ){
                fn = (function(oldFn,to){
                    return function(res){
                        delete to[ to.indexOf(oldFn) ];
                        oldFn(res);
                    };
                })(fn,to);
            }
            to.push(fn);
        };
        this.get = function(address){
            return new function(){
                var that = this;
                that.socket = null;
                that.ons = []; // repeated event listeners
                that.oners = []; // one event listeners

                var propagateMessage = function(res){
                    for( var n in that.oners ){
                        that.oners[n](res);
                    }
                    for( var nn in that.ons ){
                        that.ons[nn](res);
                    }
                };
                /* manages websocket lifecycle */
                this.open = function(then){
                    that.socket = websocket.get(address);
                    that.socket.onopen = function(){
                        that.socket.onmessage = function(res){
                            res = JSON.parse(res.data);
                            propagateMessage(res);
                        };
                        that.socket.onclose = function(){
                            propagateMessage({
                                message:'socketClose'
                            });
                        };
                        if(then){
                            then();
                        }
                    };
                };
                this.onclose = function(then){
                    that.one('socketClose',then);
                };
                /* subscribes message receivers */
                this.on = function(message,fn){
                    sub(that.ons,function(res){
                        if( res.message === message ){
                            fn(res);
                        }
                    },false);
                };
                this.one = function(message,fn){
                    sub(that.oners,function(res){
                        if( res.message === message ){
                            fn(res);
                        }
                    },true);
                };

                /* specific wirc message implementation */
                /* emits chat userMessage */
                this.sendMessage = function(userName,
                                             messageContent,
                                             messageId,
                                             messageDate,
                                             token){
                    that.socket.send(JSON.stringify({
                        message:'sendMessage',
                        userName:userName,
                        userMessage:messageContent,
                        messageId:messageId,
                        messageDate:messageDate,
                        token:token
                    }));
                };
                /*  */
                this.requestCam = function(userName,toUserName,token){
                    that.socket.send(JSON.stringify({
                        message:'userRequestCam',
                        userName:userName,
                        toUserName:toUserName,
                        token:token
                    }));
                };
                /* emits login attempt */
                this.login = function(userName){
                    that.socket.send(JSON.stringify({
                        message:'login',
                        userName:userName
                    }));
                };
                /* emits user disconnection */
                this.quit = function(userName,token){
                    that.socket.send(JSON.stringify({
                        message:'bye',
                        userName:userName,
                        token:token
                    }));
                    try{
                        that.socket.close();
                    }catch(ex){}
                };
            };
        };
    });