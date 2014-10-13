'use strict';

var ws = require('ws');

var path = require('path');
// Parse command line options
var program = require('commander');
var pkg = require( path.join(__dirname, 'package.json') );

program
    .version(pkg.version)

    .option('-p, --port <port>',
    'Port on which listens to (defaults to 9000)', parseInt)
    .option('-h, --hostname <hostname>',
    'Hostname on which listens to (defaults to localhost)')

    .parse(process.argv)
;


var WebSocketServer = ws.Server;

var UserHelper = function(){
    var that = this;
    var users = [];

    that.listUsers = function(){
        var ret = [];
        for (var n in users ){
            if( users[n] ){
                ret.push({
                    userName:users[n].userName,
                    allowWebCam:users[n].allowWebCam
                });
            }
        }
        return ret;
    };
    that.login = function(ws, userName){
        if( ! users[userName] ){
            var token =  userName+'salt' /* to improve in real world */;
            users[userName] = {
                ws:ws,
                userName:userName,
                token:token,
                messages:[],
                camSubs:[],
                allowWebCam:false,
                picture:null
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
    that.request_cam = function(userName,token,toUserName){
        if( that.check_token(userName,token) ){
            if( users[toUserName]
            && users[toUserName].allowWebCam ){
                users[userName].camSubs.push(toUserName);
                return true;
            }
        }
        return false;
    };
    that.get_cam_subs = function(userName,token){
        if( that.check_token(userName,token) ){
            return users[userName].camSubs;
        }
        return [];
    };
    that.remove = function(userName){
        if( users[userName] ){
            users[userName] = null;
            return true;
        }
        return false;
    };

    /* */
    that.broadcast = function(msg){
        for( var n in users ){
            if( users[n] )
                users[n].ws.send( JSON.stringify(msg) );
        }
    };
    that.broadcast_partial = function(msg, users){
        for( var k in users ){
            var n = users[k];
            if( users[n] )
                users[n].ws.send( JSON.stringify(msg) );
        }
    };
    that.send = function(userName, msg){
        if( users[userName] ){
            users[userName].ws.send( JSON.stringify(msg) );
        }
    };
};

var backend = function(host,port){

    var wss = new WebSocketServer({
        host: host,
        port: port
    });
    var UserH = new UserHelper();
    wss.on('connection', function(ws) {
        console.log('connected');

        /* websocket support */
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
            var user = UserH.login(ws, data.userName);
            if( user ){
                user.allowWebCam = data.allowWebCam;
                emit({
                    message:'loginSuccess',
                    token: user.token,
                    list: UserH.listUsers()
                });
                UserH.broadcast({
                    message:'userEnter',
                    userName: data.userName,
                    allowWebCam: data.allowWebCam
                });
                emit({
                    message:'userList',
                    list: UserH.listUsers()
                });
                ws.on('close', function() {
                    UserH.remove(user.userName);
                    UserH.broadcast({
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
                UserH.broadcast({
                    message:'messageSent',
                    userMessage: userMessage
                });
            }else{
                console.log('failure sendMessage : ' + data.userName);
            }
        });
        on_message('userRequestCam',function(data){
            if( UserH.request_cam(data.userName, data.token, data.toUserName) ){
                UserH.send(data.toUserName, {
                    message:'serverRequestCam',
                    userName: data.userName
                });
                console.log('negotiating userRequestCam : ' + data.userName);
                console.log('negotiating userRequestCam : ' + data.toUserName);
            }else{
                console.log('failure userRequestCam : ' + data.userName);
            }
        });
        on_message('userSendCamPicture',function(data){
            var receivers = UserH.get_cam_subs(data.userName, data.token);
            if( receivers.length ){
                UserH.broadcast_partial({
                    message:'serverSendPicture',
                    fromUserName: data.userName,
                    picture: data.picture
                }, receivers);
                //console.log('picture receive -> sent : ' + data.userName);
            }else{
                UserH.send(data.userName, {
                    message:'serverStopCam'
                });
                console.log('failure receive -> sent no : ' + data.userName);
            }
        });
        on_message('bye',function(data){
            if( UserH.logout(data.userName , data.token) ){
                UserH.broadcast({
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
    console.log('ready '+host+":"+port);

};

backend(
    program.hostname || "localhost",
    program.port || 8080
);