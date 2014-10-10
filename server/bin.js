
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
function broadcast(server, msg) {
    server.clients.forEach(function (client) {
        client.send(msg)
    })
}
var UserH = new UserHelper();
wss.on('connection', function(ws) {
    console.log("connected");
    ws.on('message', function(message) {
        var data = JSON.parse(message);
        if( data.message == "login" ){
            var user = UserH.login(data.username);
            if( user ){
                ws.send(JSON.stringify({
                    message:"login_success",
                    token: user.token
                }));
                ws.on('close', function() {
                    UserH.remove(user.username);
                    console.log("disconnected : " + user.username);
                });
                console.log("successful login : " + user.username);
                console.log("successful login : " + user.token);
            }else{
                ws.send(JSON.stringify({
                    message:"login_failure"
                }));
                console.log("failure login : " + data.username);
            }
        }
    });
    ws.on('message', function(message) {
        var data = JSON.parse(message);
        if( data.message == "send_message" ){
            var user_message = {
                username:data.username,
                user_message:data.user_message,
                message_id:data.message_id,
                message_date:data.message_date
            };
            if( UserH.emit_message(data.username , data.token, user_message) ){
                console.log("successful send_message : " + data.username);
                broadcast(wss, JSON.stringify({
                    message:"message_sent",
                    user_message: user_message
                }));
            }else{
                console.log("failure send_message : " + data.username);
            }
        }
    });
    ws.on('message', function(message) {
        var data = JSON.parse(message);
        if( data.message == "bye" ){
            if( UserH.logout(data.username , data.token) ){
                console.log("successful bye : " + data.username);
                console.log("successful bye : " + data.token);
            }else{
                console.log("failure bye : " + data.username);
                console.log("failure bye : " + data.token);
            }
            ws.close();
        }
    });
});
console.log("ready ");