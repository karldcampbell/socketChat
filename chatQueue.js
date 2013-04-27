var messages = [];
var MAX_MESSAGES = 10;

function popMessage(){
	
}

exports.addMessage = function(msg){
	if(messages.length >= MAX_MESSAGES){
		messages.shift();
	}

	messages.push(msg);
}

exports.clearMesages = function(){
	delete messages;
	messages = [];
}

exports.getMessages = function(){
	return(messages);
}

exports.toString = function(){
	var str = "";

	str = messages.join(' ');
	return(str);
}
