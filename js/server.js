// 
const express = require('express');
const SocketServer = require('ws').Server;
const path = require('path');

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');


const server = express()
    .use((req, res) => res.sendFile(INDEX) )
    .listen(PORT, () => console.log(`Listening on ${ PORT }`));

const wss = new SocketServer({ server });

wss.on('connection', function connection(ws) {

    ws.on('message', function incoming(data) {
        var dataObj = JSON.parse(data);
        ws.userName = dataObj.name;

        if(dataObj.type === 'join'){
            sendToAll({
                type: 'status',
                message: `User ${dataObj.name} has joined chat.`
            });
        } else {
            sendToAll(dataObj);
        }
    });

    ws.on('close', function(code, reason){
        if(ws.userName) {
            sendToAll({
                type: "status",
                message: `User ${ws.userName} left chat.`
            });
        }
    });

    
});

function sendToAll(data) {
    let responseData = JSON.stringify(data);

    wss.clients.forEach((client) => {
        client.send(responseData);
    });
    
};
