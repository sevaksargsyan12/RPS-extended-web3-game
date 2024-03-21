const socket = new WebSocket('ws://localhost:8080');

// Connection opened
socket.addEventListener('open', event => {
  socket.send(JSON.stringify({type: 'Connection established'}));
});

// Listen for messages
socket.addEventListener('message', event => {
    const data = JSON.parse(event.data);

    if (data.type === 'newPlayer') {
        console.log('newPlayernewPlayernewPlayer', data.address);
    }
});

export { socket };
