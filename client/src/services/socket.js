let socket;

const initSocket = (origin) => {
	const HOST = origin.replace(/^http/, 'ws').replace(/^https/, 'wss');
	socket = new WebSocket(HOST);

	return new Promise(resolve => {
		socket.onopen = resolve;
	});
}

const disconnectSocket = () => {
  	if(socket) {
  		socket.close();
  	}
}

const listenForMessages = async (messages) => {
  	if(!socket) {
  		await initSocket();
  	}
	socket.addEventListener('message', async (event) => {
        const data = JSON.parse(event.data);
        if (messages[data.type]) {
        	messages[data.type](data);
        }
    });
}

const sendMessage = async (data) => {
	if(!socket) {
  		await initSocket();
  	}
	socket.send(JSON.stringify(data));
}

export {
	initSocket,
	sendMessage,
	disconnectSocket,
	listenForMessages,
};