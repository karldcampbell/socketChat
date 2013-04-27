//single file, make everything private.
//
(function($, io, undefined) {
	function getSavedName(){
		if (localStorage){
			return(localStorage.nick);
		}
		else{
			return(null)
		}
	}

	var socket = io.connect("http://forum.kdc:8081");
	var connectionTimeout = setTimeout(function(){
			alert("Could not connect to server.");
		}, 10000);
	socket.on('hello', function(data){
		$('#chatBox').html(data);
		clearTimeout(connectionTimeout);
		connectionTimeout = null;
	});
	
	socket.on('setName', function(newName){
		var nick = getSavedName() || newName;
		$('#nickInput')[0].value = nick;
	});
	
	socket.on('message', function(msg){
		$('#chatBox').append(msg);
	});

	$('#chatForm').submit(function(e){
		e.preventDefault();
		var msg = $('#msgInput').val();
		var user = $('#nickInput').val();
		localStorage.nick = user;
		$('#msgInput').val('');

		socket.emit('message', {nick: user, msg: msg});
	});
 }(jQuery, io));
