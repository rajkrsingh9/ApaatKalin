const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 3001 });

wss.on('connection', function connection(ws) {
  console.log('A new client connected');

  ws.on('message', function incoming(data) {
    const locationData = JSON.parse(data);
    console.log('Received location update: ', locationData);

    // Broadcast to all connected clients
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(locationData));  // Send updated location to all clients
      }
    });
  });

  ws.on('close', () => console.log('Client disconnected'));
});

module.exports = wss;
