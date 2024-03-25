import "./App.css";
import * as React from "react";
import { optionsMainTheme } from "./ui/theme/config";
import { useSelector, useDispatch } from "react-redux";
import Header from "./components/Header";
import MoveSelection from "./components/MoveSelection";
import StakeSelection from "./components/StakeSelection";
import PlayerSelection from "./components/PlayerSelection";
import { setPlayers } from "./store/playersSlice";
import { updateGameState, clearGameState } from "./store/gameSlice";
import {
    createTheme,
    CssBaseline,
    ThemeProvider,
    Alert,
    Button,
} from "@mui/material";
import {
    initSocket,
    sendMessage,
    disconnectSocket,
    listenForMessages,
} from "./services/socket";
import {
    winner,
    initWeb3,
    playTheGame,
    solveTheGame,
    startNewGame,
    onTxConfirmation,
    fetchDataFromContract,
} from "./services/web3";

export const themeMain = createTheme(optionsMainTheme);

const { useEffect, useState } = React;

function App() {
    const gameState = useSelector((state) => state.gameState);
    const dispatch = useDispatch()
    const [player, setPLayer] = useState('');
    const [stake, setStake] = useState('');
    const [move, setMove] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        (async () => {
            // Connect to socket
            await initSocket();
            setSuccessMessage('CONNECTED!')
            // Connect to Metamask
            const defaultAccount = await initWeb3();

            dispatch(updateGameState({
                myAddress: defaultAccount,
            }));
            // Send other players my address. I'm online
            sendMessage({
                type: 'newPlayer',
                address: defaultAccount,
            });

            // Listen for socket messages
            listenForMessages({
                updatedPlayersList: (data) => dispatch(setPlayers(data.addressList)),
                newGameRequest: async (data) => {
                    const { accAddress1, stake } = await fetchDataFromContract(data.contractAddress);
                    const accepted = window.confirm(`New Game request from ${accAddress1} with stake ${stake}!`);
                    if (!accepted) {
                        return;
                    }
                    
                    dispatch(updateGameState({
                        stake,
                        accAddress1,
                        accAddress2: gameState.myAddress,
                        contractAddress: data.contractAddress,
                    }));
                },
                solveTheGame: async (data) => {
                    if (!gameState.moveHash) {
                        return;
                    }
                    let theWinner = 'tie';
                    const { move2 } = await solveTheGame(gameState.move, gameState.salt, data.contractAddress, gameState.myAddress);
                    if (winner(gameState.move, move2)) {
                        theWinner = gameState.myAddress;
                        console.log('Congratulations!!!!!');
                    } if (winner(move2, gameState.move)) {
                        theWinner = gameState.accAddress2;
                        console.log('The Winner is - ', gameState.accAddress2);
                    }
                    // Send the results to second player
                    sendMessage({
                        type: 'theWinner',
                        playerAddress: gameState.accAddress2,
                        theWinner,
                    });
                },
                theWinner: (data) => {
                    if (data.theWinner === gameState.myAddress) {
                        console.log('Congratulations!!!!!');
                    } if (data.theWinner === 'tie') {
                        console.log('It is a tie!')
                    } else {
                        console.log('The Winner is - ', data.theWinner);
                    }
                }
            })

        })();

        return () => {
            disconnectSocket();
        }
    }, []);
    useEffect(() => {
        // in case if there is pending transaction, keep checking the status
        if (gameState.txHash && !gameState.txStatus) {
            onTxConfirmation(gameState.txHash, (error, data) => {
                setSuccessMessage('TRANSACTION CONFIRMED!!!');
                console.log('TRANSACTION CONFIRMED!!!', data);
                if (error || !data?.status) {
                    // @TODO show error message, reset the game...
                    console.error(error, data, '[[[[[[[[[[');
                    return;
                }
                // Player 1 tx confirmation
                if (gameState.myAddress === gameState.accAddress1) {
                    dispatch(updateGameState({
                        txStatus: true,
                        contractAddress: data.contractAddress,
                    }));
                    sendMessage({
                        type: 'newGameRequest',
                        playerAddress: gameState.accAddress2,
                        contractAddress: data.contractAddress,
                    });
                }
                // Player 2 tx confirmation
                if (gameState.myAddress === gameState.accAddress2) {
                    dispatch(updateGameState({
                        txStatus: true,
                    }));
                    sendMessage({
                        type: 'solveTheGame',
                        playerAddress: gameState.accAddress1,
                        contractAddress: data.to,
                    });
                }

            })
        }
        return () => {}
    }, [gameState.txHash]);

    const play = async (address) => {
        if (!gameState.myAddress) {
            alert('Please connect to metamask');
            return;
        }
        if (gameState.txHash) {
            alert('There is ongoing game!');
            return;
        }
        // Start a new game
        if (!gameState.contractAddress) {
            try {
                const { txHash, moveHash } = await startNewGame(move, player, stake, gameState.myAddress);

                dispatch(updateGameState({
                    move,
                    stake,
                    txHash,
                    moveHash,
                    accAddress1: gameState.myAddress,
                    accAddress2: player,
                    lastAction: new Date().getTime(),
                }));
            } catch (error) {
                console.error(error);
            }
        }
        // Continue existing game
        if (gameState.contractAddress) {
            try {
                const { txHash } = await playTheGame(move, gameState.stake, gameState.contractAddress, gameState.myAddress);

                dispatch(updateGameState({
                    move,
                    txHash,
                    lastAction: new Date().getTime(),
                }));
            } catch (error) {
                console.error(error);
            }
        }
    };

    const restartTheGame = () => {
        dispatch(clearGameState());
    }

    return (
        <ThemeProvider theme={themeMain}>
            <CssBaseline/>
            <Header/>
            <div className="App">{JSON.stringify(gameState)}
                {!gameState.txHash && <Button color='success' onClick={play}>Play</Button>}
                {!!gameState.txHash && <Button onClick={restartTheGame}>Restart the game</Button>}
                <MoveSelection onSelect={setMove}/>
                <PlayerSelection onSelect={setPLayer}/>
                <StakeSelection onSelect={setStake}/>
                { errorMessage && <Alert severity="error">{errorMessage}</Alert> }
                { successMessage && <Alert severity="success">{successMessage}</Alert> }
            </div>
        </ThemeProvider>
    );
}

export default App;
