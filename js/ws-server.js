var ws = require("nodejs-websocket");


// Scream server example: "hi" -> "HI!!!"
var server = ws.createServer(function (conn) {

	conn.on("text", function (data) {
		var dataObj = JSON.parse(data);
        conn.userName = dataObj.name;
        
        if(dataObj.type === "join"){
            sendToAll({
                type: "status",
                message: "User " + dataObj.name + " has joined chat."
            });
        } else {
            sendToAll(dataObj);
        }

	});

	conn.on("close", function (code, reason) {
		if(conn.userName) {
            sendToAll({
                type: "status",
                message: "User " + conn.userName + " left chat."
            });
        }
	});
    
    conn.on("error", function(e) {
        console.log("Unexpected client disconnect");
    });

}).listen(3210, function() {
    console.log("Server is up now!");
});

function sendToAll(data) {
    var responseData = JSON.stringify(data);

    server.connections.forEach(function(conn) {
        conn.sendText(responseData);
    });
}
