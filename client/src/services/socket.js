let socket;

const initSocket = () => {//@TODO move to config
	socket = new WebSocket('ws://557c-2a00-cc47-2461-e800-8cf2-d623-ec78-4fe6.ngrok-free.app');

	return new Promise(resolve => {
		socket.onopen = resolve;
	});
}

const disconnectSocket = () => {
  	if(socket) {
  		socket.disconnect();
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