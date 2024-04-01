require('dotenv').config();
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: process.env.SOCKET_PORT });

wss.on('connection', (ws) => {
  console.log('New client connected');

  const sendUpdatedPlayersData = (client) => {
    // Send updated players data. 
    client.send(JSON.stringify({
      type: 'updatedPlayersList',
      addressList: [...wss.clients].map((c) => c?.address).filter((a) => !!a),
    }));
  }

  const sendMessageToPlayer = (playerAddress, message) => {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN &&
        client.address?.toLowerCase() === playerAddress?.toLowerCase()
      ) {
        client.send(JSON.stringify(message));
      }
    });
  }

  sendUpdatedPlayersData(ws);

  ws.on('message', (message) => {
    const data = JSON.parse(message);

    switch (data.type) {

      case 'newPlayer':
        ws.address = data.address;
        wss.clients.forEach((client) => {
          // Send updated players list to each client. 
          if (client.readyState === WebSocket.OPEN) {
            sendUpdatedPlayersData(client);
          }
        });
        break;

      case 'newGameRequest':
        // Send the player a request to play. 
        sendMessageToPlayer(data.playerAddress, {
          type: 'newGameRequest',
          contractAddress: data.contractAddress,
        });
        break;

      case 'solveTheGame':
        // Send the player a request to open his move. 
        sendMessageToPlayer(data.playerAddress, {
          type: 'solveTheGame',
          contractAddress: data.contractAddress,
        });
        break;

      case 'theWinner':
        // Send the player the result. 
        sendMessageToPlayer(data.playerAddress, {
          type: 'theWinner',
          theWinner: data.theWinner,
        });
        break;
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});