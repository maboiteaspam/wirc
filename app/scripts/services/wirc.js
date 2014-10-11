angular.module('wirc', [
])
    /* Provides websocket access within angularJS  */
    .service('websocket', function() {
        this.get = function(address){
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
            return websocket;
        }
    })
    /* Implements event driven webocket consumption (it s a stream..) */
    /* Implements convenient methods to consume wirc server */
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
                that.ons = []; // repeated event listeners
                that.oners = []; // one event listeners

                var propagate_message = function(res){
                    for( var n in that.oners ){
                        that.oners[n](res)
                    }
                    for( var n in that.ons ){
                        that.ons[n](res)
                    }
                };
                /* manages websocket lifecycle */
                this.open = function(then){
                    that.socket = websocket.get(address);
                    that.socket.onopen = function(evt){
                        that.socket.onmessage = function(res){
                            res = JSON.parse(res.data);
                            propagate_message(res);
                        };
                        that.socket.onclose = function(){
                            propagate_message({
                                message:"socket_close"
                            });
                        };
                        if(then) then();
                    };
                }
                this.onclose = function(then){
                    that.one("socket_close",then);
                }
                /* subscribes message receivers */
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

                /* specific wirc message implementation */
                /* emits chat user_message */
                this.send_message = function(username,message_content,message_id,message_date,token){
                    that.socket.send(JSON.stringify({
                        message:'send_message',
                        username:username,
                        user_message:message_content,
                        message_id:message_id,
                        message_date:message_date,
                        token:token
                    }));
                }
                /* emits login attempt */
                this.login = function(username){
                    that.socket.send(JSON.stringify({
                        message:'login',
                        username:username
                    }));
                }
                /* emits user disconnection */
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