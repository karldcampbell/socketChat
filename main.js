var connect = require("connect");
var socketLib = require("socket.io");

var msgQueue = require('./chatQueue.js');

var appServerPort = 8080;
var socketServerPort = 8081;

var appServer = connect();
var socketServer = socketLib.listen(socketServerPort);
//appServer.use(myHandler);
appServer.use(connect.logger('short'));
appServer.use(connect.static(__dirname +  '/static'));
appServer.listen(appServerPort);

var numUsers = 0;

socketServer.sockets.on('connection', function(socket){
	numUsers++;
	socket.emit('hello', "Connected to Server!<br />You may now change your username.<br />");
	socket.emit('message', msgQueue.toString());
	socket.emit('setName', "User_" + numUsers);
	socket.on('message', function(data){
		var msgString = processMsg(data);
		msgQueue.addMessage(msgString);
		console.log(msgQueue.getMessages());
		socketServer.sockets.emit('message', msgString);
	});
});


console.log("Server started on port " + appServerPort);

function myHandler(req, res, next){
	//next()	
	res.writeHead(200);
	res.end("Hello World!");
}

function processMsg(data){
	var msgString = '<b>' + data.nick + '</b>: ';
	if(data.msg.indexOf('://') != -1){
		var tmp = data.msg.indexOf('://');
		var urlStart = data.msg.slice(0, tmp).lastIndexOf(' ');
		var urlEnd = data.msg.indexOf(' ', urlStart+1);
		if (urlEnd == -1){
			urlEnd = data.msg.length;
		}
		var url = data.msg.substring(urlStart, urlEnd);
		msgString += data.msg.substring(0, urlStart);
		msgString += ' <a href="' + url + '" target="blank">' + url + '</a> ';
		msgString += data.msg.substring(urlEnd);
	}
	else{
		msgString += data.msg;
	}
	msgString += '<br />';
		return(msgString)
}
