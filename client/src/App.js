import {createTheme, CssBaseline, ThemeProvider} from "@mui/material";
import Header from "./components/Header";
import {optionsMainTheme} from "./ui/theme/config";
import { useSelector, useDispatch } from 'react-redux';
import {setAccount} from "./store/etheriumSlice";
import MoveSelection from "./components/MoveSelection";
import './App.css';
import PlayerSelection from "./components/PlayerSelection";
import * as React from "react";
import PlayForm from "./components/PlayForm";
import {Button} from "@mui/material";
import {store} from "./store/store";
import {Provider} from "react-redux";
import { socket } from './socket';

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
    
    return (
        <ThemeProvider theme={themeMain}>
            <CssBaseline/>
            <Header account={account}/>
            <div className="App">
                <PlayForm move={move} player={player}/>
                <MoveSelection onSelect={handleMoveSelection}/>
                <PlayerSelection onSelect={handlePlayerSelection}/>
            </div>
        </ThemeProvider>
    );
}

export default App;
