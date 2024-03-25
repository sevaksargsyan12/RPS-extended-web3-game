const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('New client connected');

  const sendUpdatedPlayersData = (client) => {
    // Send updated players data. 
    client.send(JSON.stringify({
      type: 'updatedPlayersList',
      addressList: [...wss.clients].map((c) => c?.address).filter((a) => !!a),
    }));
  }

  sendUpdatedPlayersData(ws);

  ws.on('message', (message) => {
    const data = JSON.parse(message);

    console.log(`Received new message: ${JSON.stringify(data)}`);
    if (data.type === 'newPlayer') {
      ws.address = data.address;

      wss.clients.forEach((client) => {
        // Send updated players list to each client. 
        if (client.readyState === WebSocket.OPEN) {
          sendUpdatedPlayersData(client);
        }
      });
    }
    if (data.type === 'newGameRequest') {
      wss.clients.forEach((client) => {
        // Send the player a request to play. 
        if (client.readyState === WebSocket.OPEN && client.address === data.playerAddress) {
          client.send(JSON.stringify({
            type: 'newGameRequest',
            contractAddress: data.contractAddress,
          }));
        }
      });
    }
    if (data.type === 'solveTheGame') {
      wss.clients.forEach((client) => {
        // Send the player a request to play. 
        if (client.readyState === WebSocket.OPEN &&
          client.address?.toLowerCase() === data.playerAddress?.toLowerCase()
        ) {
          client.send(JSON.stringify({
            type: 'solveTheGame',
            contractAddress: data.contractAddress,
          }));
        }
      });
    }
    if (data.type === 'theWinner') {
      wss.clients.forEach((client) => {
        // Send the player a request to play. 
        if (client.readyState === WebSocket.OPEN &&
          client.address?.toLowerCase() === data.playerAddress?.toLowerCase()
        ) {
          client.send(JSON.stringify({
            type: 'theWinner',
            theWinner: data.theWinner,
          }));
        }
      });
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});