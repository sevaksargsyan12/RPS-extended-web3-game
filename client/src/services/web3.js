import { Web3 } from "web3";
import RPS from "../contracts/RPS.json";
import Hasher from "../contracts/Hasher.json";

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

const startNewGame = async (move, player, stake, fromAccount) => {
	const RPSContract = new web3.eth.Contract(RPS.abi);//@TODO move to config
    const hasherContract = new web3.eth.Contract(Hasher.abi, '0x4935C04cC2e05A20bd075046F787E81F8bB21d22');
    const moveHash = await hasherContract.methods.hash(move, '111111').call();
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

const solveTheGame = async (move, salt, contractAddress, fromAccount) => {
	const RPSContract = new web3.eth.Contract(RPS.abi, contractAddress);
	
	await RPSContract.methods.solve(move, '111111').call({
		from: fromAccount,
	});
	const move2 = await RPSContract.methods.c2().call();
	return {
		move2: Number(move2),
	};
}

const onTxConfirmation = (txHash, cb) => {
	let timer = window.setInterval(async () => {
		console.log('checkcheckcheckcheckcheck');
		try {
        	const receipt = await web3.eth.getTransactionReceipt(txHash);
        	if (receipt?.status) {
                clearInterval(timer);
                cb(receipt);
            }
        } catch(error) {
			// Continue to check
        }
    }, 1000);
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

const onTimeout = async (contractAddress, player1Timeout) => {
	const RPSContract = new web3.eth.Contract(RPS.abi, contractAddress);
	if (player1Timeout) {
		await RPSContract.methods.j1Timeout().call();
	} else {
		await RPSContract.methods.j2Timeout().call();
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
