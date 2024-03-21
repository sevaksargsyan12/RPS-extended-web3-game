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

    const connectToWallet = async () => {
        // //check metamask is installed
        // if (!window.ethereum) {
        //     alert('Please download metamask');
        // }
        // // instantiate Web3 with the injected provider
        // const web3 = new Web3(window.ethereum);
        //
        // //request user to connect accounts (Metamask will prompt)
        // await window.ethereum.request({ method: 'eth_requestAccounts' });

        //get the connected accounts
        // const accounts = await web3.eth.getAccounts();
        //
        // dispatch(setAccount(web3));
        //
        // //show the first connected account in the react page
        // console.log(web3);



    };

  return (
      <ThemeProvider theme={themeMain}>
          <CssBaseline/>
          <Header account={account}/>
        <div className="App">
            <PlayForm move={move} player={player}/>
            <MoveSelection onSelect={handleMoveSelection}/>
            <PlayerSelection onSelect={handlePlayerSelection}/>
            <Button
                onClick={connectToWallet}
                variant="btn-success"
            >
                Connect to wallet
            </Button>
        </div>
      </ThemeProvider>
  );
}

export default App;
