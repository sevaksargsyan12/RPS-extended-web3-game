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

export const themeMain = createTheme(optionsMainTheme);

function App() {
    const account = useSelector((state) => state.account.account)
    const dispatch = useDispatch()
    const [player, setPLayer] = React.useState('');
    const [move, setMove] = React.useState('');
    const handleMoveSelection = (move) => {
        setMove(move);
    };

    const handlePlayerSelection = (player) => {
        setPLayer(player);
    };

    const handleNewPlayer = (address) => {
        socket.send(JSON.stringify({
            type: 'newPlayer',
            address,
        }));
    };
    const socket = new WebSocket('ws://localhost:8080');

    // Listen for messages
    socket.addEventListener('message', (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'updatedPlayersList') {
            console.log('updatedPlayersList -> ', data.addressList);
            dispatch(setPlayers(data.addressList));
        }
    });

    return (
        <ThemeProvider theme={themeMain}>
            <CssBaseline/>
            <Header account={account}/>
            <div className="App">
                <PlayForm move={move} player={player} onNewPlayer={handleNewPlayer}/>
                <MoveSelection onSelect={handleMoveSelection}/>
                <PlayerSelection onSelect={handlePlayerSelection}/>
            </div>
        </ThemeProvider>
    );
}

export default App;
