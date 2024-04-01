import { Web3 } from "web3";
import passworder from "browser-passworder";
import RPS from "../contracts/RPS.json";
import Hasher from "../contracts/Hasher.json";
import { setObject, getObject } from "./webStorage";

let web3;

const initWeb3 = async () => {
	//check metamask is installed
    if (!window.ethereum) {
        alert('Please download metamask');
		return ;
    }
    // instantiate Web3 with the injected provider
    web3 = new Web3(window.ethereum);
    //get the connected accounts
    const accounts = await web3.eth.requestAccounts();

    web3.eth.Contract.handleRevert = true;

    return accounts?.[0]?.toLowerCase();
}

const startNewGame = async (move, player, stake, password, fromAccount) => {
	const salt = await generateAndSaveSalt(move, password);
	const RPSContract = new web3.eth.Contract(RPS.abi);
    const hasherContract = new web3.eth.Contract(Hasher.abi, process.env.REACT_APP_HASHER_CONTRACT_ADDRESS);
    const moveHash = await hasherContract.methods.hash(move, salt).call();
    const contractDeployer = RPSContract.deploy({
        data: RPS.bytecode,
        arguments: [moveHash, player],
    });
    const value = web3.utils.toWei(stake, 'ether');

    return new Promise((resolve, reject) => {
    	try {
			contractDeployer.send({
		        from: fromAccount,
		        value,
		    }).once('transactionHash', (txHash) => {
	            resolve({
	            	txHash,
	            	moveHash,
	            })
	        }).on('error', reject);
		} catch(error) {
			reject(error);
		}
	});
}

const playTheGame = async (move, stake, contractAddress, fromAccount) => {
    const value = web3.utils.toWei(stake, 'ether');
	const RPSContract = new web3.eth.Contract(RPS.abi, contractAddress);
    const play = await RPSContract.methods.play(move);
    
	return new Promise((resolve, reject) => {
		try {
		    play.send({
		        value,
		        from: fromAccount,
		    }).once('transactionHash', (txHash) => {
		        resolve({
	            	txHash,
	            })
		    }).on('error', reject);
		} catch(error) {
			reject(error);
		}
	});
}

const solveTheGame = async (password, contractAddress, fromAccount) => {
	const { salt, move } = await restoreSaltAndMove(password)
	const RPSContract = new web3.eth.Contract(RPS.abi, contractAddress);
	
	await RPSContract.methods.solve(move, salt).call({
		from: fromAccount,
	});
	const move2 = await RPSContract.methods.c2().call();

	return {
		move,
		move2: Number(move2),
	};
}

const getTransaction = async (txHash) => {
	let txData;
	try {
		txData = await web3.eth.getTransactionReceipt(txHash);
	} catch(e) {
		console.log(e);
	}
	return txData;
}

const onTimeout = async (contractAddress, player1Timeout, fromAccount) => {
	const RPSContract = new web3.eth.Contract(RPS.abi, contractAddress);
	if (player1Timeout) {
		await RPSContract.methods.j1Timeout().call({ from: fromAccount });
	} else {
		await RPSContract.methods.j2Timeout().call({ from: fromAccount });
	}
}

const fetchDataFromContract = async (contractAddress) => {
	const RPSContract = new web3.eth.Contract(RPS.abi, contractAddress);
	const accAddress1 = await RPSContract.methods.j1().call();
	const stake = await RPSContract.methods.stake().call();

	return {
		accAddress1: accAddress1.toLowerCase(),
		stake: web3.utils.fromWei(stake, 'ether'),
	}
}

const winner = (player1, player2) => {
    if (player1 === player2)
    	return false;
    else if (player1 % 2 === player2 % 2)
    	return player1 < player2;
    else 
    	return player1 > player2;
}

const generateAndSaveSalt = async (move, password) => {
	const randomNumbers = window.crypto.getRandomValues(new Uint8Array(16));

	// convert byte array to hexademical representation
	const bytesHex = randomNumbers.reduce((o, v) => o + ('00' + v.toString(16)).slice(-2), '');

	// convert hexademical value to a decimal string
	const salt = window.BigInt('0x' + bytesHex).toString(10);

	const keysBlob = await passworder.encrypt(password, {
		move,
		salt,
	});

	// Save to storage
	setObject('RPSSLkeys', keysBlob);

	return salt;
}

const restoreSaltAndMove = async (password) => {
	// Get from storage
	const keysBlob = getObject('RPSSLkeys');

	const result = await passworder.decrypt(password, keysBlob);

	return result;
}

export {
	winner,
	initWeb3,
	onTimeout,
	playTheGame,
	solveTheGame,
	startNewGame,
	getTransaction,
	fetchDataFromContract,
}
