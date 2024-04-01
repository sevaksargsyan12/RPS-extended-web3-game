import "./App.css";
import * as React from "react";
import {optionsMainTheme} from "./ui/theme/config";
import {useSelector, useDispatch, useStore} from "react-redux";
import Header from "./components/Header";
import MoveSelection from "./components/MoveSelection";
import StakeSelection from "./components/StakeSelection";
import PlayerSelection from "./components/PlayerSelection";
import usePrettyConfirm from "./shared/components/PrettyConfirm";
import {setPlayers} from "./store/playersSlice";
import {updateGameState, clearGameState} from "./store/gameSlice";
import {
    createTheme,
    CssBaseline,
    ThemeProvider,
    Alert,
    Snackbar,
    Button, Box,
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
    onTimeout,
    playTheGame,
    solveTheGame,
    startNewGame,
    getTransaction,
    fetchDataFromContract,
} from "./services/web3";

export const themeMain = createTheme(optionsMainTheme);

const {useEffect, useState} = React;

function App() {
    const {getState} = useStore();
    const [getConfirmation, PrettyConfirm] = usePrettyConfirm();
    const gameState = useSelector((state) => state.gameStateStore);
    const dispatch = useDispatch()
    const [move, setMove] = useState('');
    const [stake, setStake] = useState('');
    const [player, setPlayer] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        (async () => {
            // Connect to socket
            await initSocket(window.location.origin);
            // Connect to Metamask
            const defaultAccount = await initWeb3();
            setSuccessMessage('CONNECTED!')

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
                    const gameState = getState().gameStateStore;

                    try {
                        const {accAddress1, stake} = await fetchDataFromContract(data.contractAddress);
                        const accepted = await getConfirmation(`New Game request from ${accAddress1} with stake ${stake}!`)
                        if(!accepted) {
                            return;
                        }
                        dispatch(updateGameState({
                            stake,
                            accAddress1,
                            accAddress2: gameState.myAddress,
                            contractAddress: data.contractAddress,
                        }));
                    } catch (error) {
                        setErrorMessage('There is something wrong with contract usage!');
                        console.error(error);
                    }
                },
                solveTheGame: async (data) => {
                    const gameState = getState().gameStateStore;

                    if (!gameState.moveHash) {
                        return;
                    }
                    const password = await getConfirmation(`Please provide your password to reveal your move!`, true);
                    if(!password) {
                        return;
                    }
                    try {
                        let theWinner = 'tie';
                        const {move2} = await solveTheGame(password, data.contractAddress, gameState.myAddress);
                        if (winner(gameState.move, move2)) {
                            theWinner = gameState.myAddress;
                            setSuccessMessage('Congratulations!')
                        } else if (winner(move2, gameState.move)) {
                            theWinner = gameState.accAddress2;
                            setSuccessMessage(`The Winner is - ${gameState.accAddress2}`)
                        }
                        dispatch(updateGameState({
                            theWinner,
                        }));
                        // Send the results to second player
                        sendMessage({
                            type: 'theWinner',
                            playerAddress: gameState.accAddress2,
                            theWinner,
                        });
                    } catch (error) {
                        setErrorMessage('There is something wrong with contract usage!');
                        console.error(error);
                    }
                },
                theWinner: (data) => {
                    const gameState = getState().gameStateStore;

                    if (data.theWinner === gameState.myAddress) {
                        setSuccessMessage('Congratulations!!!!!')
                    } else if (data.theWinner === 'tie') {
                        setSuccessMessage('It is a tie!')
                    } else {
                        setSuccessMessage(`The Winner is - ${data.theWinner}`);
                    }
                    dispatch(updateGameState({
                        theWinner: data.theWinner,
                    }));
                }
            })
        })();

        return () => {
            disconnectSocket();
        }
    }, []);
    useEffect(() => {
        let timeoutInterval;
        let txStatusInterval;
        // in case if there is pending transaction, keep checking the status
        if (gameState.txHash && !gameState.txStatus) {
            txStatusInterval = setInterval(async () => {
                const txData = await getTransaction(gameState.txHash);
                if (!txData?.status) {
                    // Continue to check...
                    return;
                }
                setSuccessMessage('TRANSACTION CONFIRMED!!!');
                // Player 1 tx confirmation
                if (gameState.myAddress === gameState.accAddress1) {
                    dispatch(updateGameState({
                        txStatus: true,
                        contractAddress: txData.contractAddress,
                    }));
                    sendMessage({
                        type: 'newGameRequest',
                        playerAddress: gameState.accAddress2,
                        contractAddress: txData.contractAddress,
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
                        contractAddress: txData.to,
                    });
                }

            }, 1000)
        } else {
            clearInterval(txStatusInterval);
        }
        // Waiting for other players game
        if (gameState.txHash && gameState.txStatus && !gameState.theWinner && gameState.lastAction) {
            timeoutInterval = setInterval(async () => {
                const now = new Date();
                const lastAction = new Date(gameState.lastAction);

                if (now - lastAction < 1000*60*6) {
                    return;
                }
                try {
                    await onTimeout(gameState.contractAddress, gameState.myAddress === gameState.accAddress2, gameState.myAddress);
                    setErrorMessage('Timeout: player doesn\'t move. Resetting the game...');
                    dispatch(clearGameState());
                } catch (error) {
                    setErrorMessage('There is something wrong with contract usage!');
                    console.error(error);
                }
            }, 60 * 1000);
        } else {
            clearInterval(timeoutInterval);
        }
        return () => {
            clearInterval(timeoutInterval);
            clearInterval(txStatusInterval);
        }
    }, [gameState.txHash, gameState.txStatus, gameState.theWinner, gameState.lastAction]);

    const play = async () => {
        if (!gameState.myAddress) {
            setErrorMessage('Please connect to metamask');
            return;
        }
        if (gameState.txHash) {
            setErrorMessage('There is ongoing game!');
            return;
        }
        // Start a new game
        if (!gameState.contractAddress) {
            try {
                const password = await getConfirmation(`Please select a password and keep in mind to reveal your move!`, true);
                if(!password) {
                    return;
                }
                const {txHash, moveHash} = await startNewGame(move, player, stake, password, gameState.myAddress);

                dispatch(updateGameState({
                    stake,
                    txHash,
                    moveHash,
                    accAddress1: gameState.myAddress,
                    accAddress2: player,
                    lastAction: new Date().getTime(),
                }));
            } catch (error) {
                setErrorMessage('There is something wrong with contract usage!');
                console.error(error);
            }
        }
        // Continue existing game
        if (gameState.contractAddress) {
            try {
                const {txHash} = await playTheGame(move, gameState.stake, gameState.contractAddress, gameState.myAddress);

                dispatch(updateGameState({
                    move,
                    txHash,
                    lastAction: new Date().getTime(),
                }));
            } catch (error) {
                setErrorMessage('There is something wrong with contract usage!');
                console.error(error);
            }
        }
    };

    const restartTheGame = () => {
        dispatch(clearGameState());
    }
    const playButtonAddProps =  {disabled: !!gameState.txHash}

    return (
        <ThemeProvider theme={themeMain}>
            <CssBaseline/>
            <Header/>
            <PrettyConfirm />
            <div className="App">
                <Box className='game' sx={{mx: 'auto', p: 2, mt: 2,  boxShadow: 3, maxWidth: '620px' }}>
                    <MoveSelection onSelect={setMove}/>
                    <br/>
                    <PlayerSelection onSelect={setPlayer}/>
                    <br/>
                    <StakeSelection onSelect={setStake}/>
                    <br/>
                    {!gameState.txHash &&
                        <Button className='play-button game-button' {...playButtonAddProps} color='success' onClick={play}>Play</Button>}
                    {!!gameState.txHash &&
                        <Button className='restart-game-button game-button' onClick={restartTheGame}>Restart the game</Button>}
                </Box>
                {errorMessage &&
                    <Snackbar open={!!errorMessage} autoHideDuration={4000} onClose={() => setErrorMessage('')}>
                        <Alert severity="error">{errorMessage}</Alert>
                    </Snackbar>}
                {successMessage &&
                    <Snackbar open={!!successMessage} autoHideDuration={4000} onClose={() => setSuccessMessage('')}>
                        <Alert severity="success">{successMessage}</Alert>
                    </Snackbar>}
            </div>
        </ThemeProvider>
    );
}

export default App;
