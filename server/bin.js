
var WebSocketServer = require('ws').Server
    , wss = new WebSocketServer({port: 8080})
    , users = []
    ;

wss.on('connection', function(ws) {
    console.log("connected");
    ws.on('message', function(message) {
        var data = JSON.parse(message);
        if( data.message == "login" ){
            if( ! users[data.username] ){
                users[data.username] = {
                    some:'to define'
                };
                ws.send(JSON.stringify({
                    message:"login_success"
                }));
                console.log("successful login : " + data.username);
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
            if( users[data.username] ){
                users[data.username] = null;
                console.log("successful bye : " + data.username);
            }else{
                console.log("failure bye : " + data.username);
            }
            ws.send(JSON.stringify({
                message:"bye"
            }));
            ws.close();
        }
    });
    ws.on('close', function(message) {

    });
});
console.log("ready ");