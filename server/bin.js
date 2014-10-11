
var WebSocketServer = require('ws').Server
    , wss = new WebSocketServer({port: 8080})
    , users = []
    ;

var UserHelper = function(){
    var that = this;
    that.listUsers = function(){
        var ret = [];
        for (var n in users ){
            if( users[n] ){
                ret.push({
                    userName:users[n].userName
                });
            }
        }
        return ret;
    };
    that.login = function(userName){
        if( ! users[userName] ){
            var token =  userName+'salt' /* to improve in real world */;
            users[userName] = {
                userName:userName,
                token:token,
                messages:[]
            };
            return users[userName];
        }
        return false;
    };
    that.logout = function(userName,token){
        if( that.check_token(userName,token) ){
            users[userName] = null;
            return true;
        }
        return false;
    };
    that.check_token = function(userName,token){
        if( users[userName]
            && users[userName].token == token ){
            return true;
        }
        return false;
    };
    that.emit_message = function(userName,token,message){
        if( that.check_token(userName,token) ){
            users[userName].messages.push(message);
            return true;
        }
        return false;
    };
    that.remove = function(userName){
        if( users[userName] ){
            users[userName] = null;
            return true;
        }
        return false;
    };
};
var UserH = new UserHelper();
wss.on('connection', function(ws) {
    console.log('connected');

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
                h(data);
            }
        });
    };

    /* app specific implementation */
    on_message('login',function(data){
        var user = UserH.login(data.userName);
        if( user ){
            emit({
                message:'loginSuccess',
                token: user.token,
                list: UserH.listUsers()
            });
            broadcast({
                message:'userEnter',
                userName: data.userName
            });
            emit({
                message:'userList',
                list: UserH.listUsers()
            });
            ws.on('close', function() {
                UserH.remove(user.userName);
                broadcast({
                    message:'userLeave',
                    userName: user.userName
                });
                console.log('disconnected : ' + user.userName);
            });
            console.log('successful login : ' + user.userName);
            console.log('successful login : ' + user.token);
        }else{
            emit({
                message:'login_failure'
            });
            console.log('failure login : ' + data.userName);
        }
    });
    on_message('sendMessage',function(data){
        var userMessage = {
            userName:data.userName,
            userMessage:data.userMessage,
            messageId:data.messageId,
            messageDate:data.messageDate
        };
        if( UserH.emit_message(data.userName , data.token, userMessage) ){
            console.log('successful sendMessage : ' + data.userName);
            broadcast({
                message:'messageSent',
                userMessage: userMessage
            });
        }else{
            console.log('failure sendMessage : ' + data.userName);
        }
    });
    on_message('bye',function(data){
        if( UserH.logout(data.userName , data.token) ){
            broadcast({
                message:'userLeave',
                userName: data.userName
            });
            console.log('successful bye : ' + data.userName);
            console.log('successful bye : ' + data.token);
        }else{
            console.log('failure bye : ' + data.userName);
            console.log('failure bye : ' + data.token);
        }
        ws.close();
    });
});
console.log('ready ');