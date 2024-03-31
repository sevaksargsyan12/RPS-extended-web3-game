import React from "react";
import {useSelector} from "react-redux";
import {AppBar, Toolbar, Typography} from "@mui/material";

const Header = () => {
    const gameState = useSelector((state) => state.gameStateStore);
    let message;
    if (gameState.txHash && !gameState.txStatus) {
        message = 'Waiting for transaction confirmation...';
    } else if (gameState.txHash && gameState.txStatus && !gameState.theWinner) {
        message = 'Waiting for other player\'s move...';
    } else if (gameState.theWinner) {
        if (gameState.theWinner === gameState.myAddress) {
            message = 'Congratulations!!!!!';
        } else if (gameState.theWinner === 'tie') {
            message = 'It is a tie!';
        } else {
            message = `You lost :(`;
        }
    }
    return (
        <AppBar position="static" color="secondary">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                    Rock, Paper, Scissors, Spock, Lizard
                </Typography>
                <Typography variant="h6" component="div" sx={{flexGrow: 1}} align="right">
                    {message}
                </Typography>      
            </Toolbar>
        </AppBar>
    );
};

export default Header;