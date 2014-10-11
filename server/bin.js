
var WebSocketServer = require('ws').Server
    , wss = new WebSocketServer({port: 8080})
    , users = []
    ;

var UserHelper = function(){
    var that = this;
    that.login = function(username){
        if( ! users[username] ){
            var token =  username+'salt' /* to improve in real world */;
            users[username] = {
                username:username,
                token:token,
                messages:[]
            };
            return users[username];
        }
        return false;
    }
    that.logout = function(username,token){
        if( that.check_token(username,token) ){
            users[username] = null;
            return true;
        }
        return false;
    }
    that.check_token = function(username,token){
        if( users[username]
            && users[username].token == token ){
            return true;
        }
        return false;
    }
    that.emit_message = function(username,token,message){
        if( that.check_token(username,token) ){
            users[username].messages.push(message)
            return true;
        }
        return false;
    }
    that.remove = function(username){
        if( users[username] ){
            users[username] = null;
            return true;
        }
        return false;
    }
}
var UserH = new UserHelper();
wss.on('connection', function(ws) {
    console.log("connected");

    /* websocket support */
    var broadcast = function(msg){
        wss.clients.forEach(function (client) {
            client.send( JSON.stringify(msg) );
        })
    };
    var emit = function(msg){
        ws.send( JSON.stringify(msg) );
    };
    var on_message = function(m,h){
        ws.on('message', function(raw_message) {
            var data = JSON.parse(raw_message);
            if( data.message == m ){
                h(raw_message);
            }
        });
    };

    /* app specific implementation */
    on_message("login",function(data){
        var user = UserH.login(data.username);
        if( user ){
            emit({
                message:"login_success",
                token: user.token
            });
            broadcast({
                message:"user_enter",
                username: data.username
            });
            ws.on('close', function() {
                UserH.remove(user.username);
                console.log("disconnected : " + user.username);
            });
            console.log("successful login : " + user.username);
            console.log("successful login : " + user.token);
        }else{
            emit({
                message:"login_failure"
            });
            console.log("failure login : " + data.username);
        }
    });
    on_message("send_message",function(data){
        var user_message = {
            username:data.username,
            user_message:data.user_message,
            message_id:data.message_id,
            message_date:data.message_date
        };
        if( UserH.emit_message(data.username , data.token, user_message) ){
            console.log("successful send_message : " + data.username);
            broadcast({
                message:"message_sent",
                user_message: user_message
            });
        }else{
            console.log("failure send_message : " + data.username);
        }
    });
    on_message("bye",function(data){
        if( UserH.logout(data.username , data.token) ){
            broadcast({
                message:"user_leave",
                username: data.username
            });
            console.log("successful bye : " + data.username);
            console.log("successful bye : " + data.token);
        }else{
            console.log("failure bye : " + data.username);
            console.log("failure bye : " + data.token);
        }
        ws.close();
    });
});
console.log("ready ");