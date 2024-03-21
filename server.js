const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('New client connected');

  ws.on('message', (message) => {
    const data = JSON.parse(message);

    if (data.type === 'newPlayer') {
      console.log(`Received newPlayerAddress: ${data.address}`);
      
      // Send new player data to others. 
      ws.send(JSON.stringify({
        type: 'newPlayer',
        address: data.address,
      }));
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});