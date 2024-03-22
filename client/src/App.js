import {createTheme, CssBaseline, ThemeProvider} from "@mui/material";
import Header from "./components/Header";
import {optionsMainTheme} from "./ui/theme/config";
import { useSelector, useDispatch } from 'react-redux';
import {setAccount} from "./store/etheriumSlice";
import {setPlayers} from "./store/playersSlice";
import MoveSelection from "./components/MoveSelection";
import './App.css';
import PlayerSelection from "./components/PlayerSelection";
import * as React from "react";
import PlayForm from "./components/PlayForm";
import {Button} from "@mui/material";
import {store} from "./store/store";
import {Provider} from "react-redux";
import RPS from './contracts/RPS.json';
import Hasher from './contracts/Hasher.json';
import {Web3} from "web3";

export const themeMain = createTheme(optionsMainTheme);

function App() {
    const account = useSelector((state) => state.account.account)
    const dispatch = useDispatch()
    const [player, setPLayer] = React.useState('');
    const [move, setMove] = React.useState('');
    let web3;
    let socket;
    let defaultAccount;
    const handleMoveSelection = (move) => {
        setMove(move);
    };

    const handlePlayerSelection = (player) => {
        setPLayer(player);
    };

    const handleNewPlay = async (address) => {
        if (!web3) {
            alert('Please connect to metamask');
            return;
        }
        if (!socket) {
            alert('Please reload the page');
            return;
        }
        const RPSContract = new web3.eth.Contract(RPS.abi);
        const hasherContract = new web3.eth.Contract(Hasher.abi, '0x4935C04cC2e05A20bd075046F787E81F8bB21d22');
        const moveHash = await hasherContract.methods.hash(move, '1111211').call();
console.log(move, player, 'moveHash -> ', moveHash);
        RPSContract.handleRevert = true;

        const contractDeployer = RPSContract.deploy({
            data: RPS.bytecode,
            arguments: [moveHash, player],
        });
        const gas = await contractDeployer.estimateGas({
            from: defaultAccount,
        });
        console.log('estimated gas:', gas);

        try {
            const tx = await contractDeployer.send({
                from: defaultAccount,
                gas,
                gasPrice: 10000000000,
            });
            console.log(tx, '   Contract deployed at address: ' + tx.options.address);
            socket.send(JSON.stringify({
                type: 'newGameRequest',
                playerAddress: player,
                contractAddress: tx.options.address,
            }));
        } catch (error) {
            console.error(error);
        }
        
    };

    // SOCKET
    (() => {
        if (socket) {
            return;
        }
        const socketI = new WebSocket('ws://0397-37-252-92-141.ngrok-free.app');
        socketI.onopen = (event, a) => {
            console.log(event, a);
            socket = socketI;

            // WEB3
            (async () => {
                if (web3) {
                    return;
                }

                //check metamask is installed
                if (!window.ethereum) {
                    alert('Please download metamask');
                }
                // instantiate Web3 with the injected provider
                web3 = new Web3(window.ethereum);

                //request user to connect accounts (Metamask will prompt)
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                //get the connected accounts
                const accounts = await web3.eth.getAccounts();
                defaultAccount = accounts[0];
                // web3.eth.getBalance(defaultAccount).then(console.log);

                socket.send(JSON.stringify({
                    type: 'newPlayer',
                    address: defaultAccount,
                }));
            })();
        };
        // Listen for messages
        socketI.addEventListener('message', (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'updatedPlayersList') {
                console.log('updatedPlayersList -> ', data.addressList);
                dispatch(setPlayers(data.addressList));
            }
            if (data.type === 'updatedGameRequest') {
                console.log('updatedGameRequest -> ', data.contractAddress);
            }
        });
    })();

    return (
        <ThemeProvider theme={themeMain}>
            <CssBaseline/>
            <Header account={account}/>
            <div className="App">
                <PlayForm move={move} player={player} onNewPlay={handleNewPlay}/>
                <MoveSelection onSelect={handleMoveSelection}/>
                <PlayerSelection onSelect={handlePlayerSelection}/>
            </div>
        </ThemeProvider>
    );
}

export default App;
