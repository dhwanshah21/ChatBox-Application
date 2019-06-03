const WebSocket = require('ws');
const redis = require('redis');
const client = redis.createClient();


const wss = new WebSocket.Server({ port : 6000 });

// Web Socket has 4 events. When open -> connection event -> message event 
// wss : webSocketServer
wss.on('connection', (ws) => {
    console.log('Someone connected!');
});

client.on('message', (channel, message) => {
    console.log(`subscriber hears message ${message}`);
    wss.clients.forEach( (client) => {
        client.send(message);
    });
});

client.subscribe('testPublish');