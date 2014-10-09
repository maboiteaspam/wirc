
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
                token:token
            };
            return users[username];
        }
        return false;
    }
    that.logout = function(username,token){
        if( users[username]
            && users[username].token == token ){
            users[username] = null;
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