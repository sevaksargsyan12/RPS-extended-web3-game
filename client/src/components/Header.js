import React from 'react';
import { useSelector } from 'react-redux';
import { AppBar, Toolbar, Typography } from "@mui/material";

const Header = ({}) => {
    const gameState = useSelector((state) => state.gameStateStore);
    let message;
    if (gameState.txHash && !gameState.txStatus) {
        message = 'Waiting for transaction confirmation...';
    } else if (gameState.txHash && gameState.txStatus && !gameState.theWinner) {
        message = 'Waiting for other player\'s move...';
    } else if (gameState.theWinner) {
        message = gameState.theWinner;
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
                {gameState?.myAddress && <Typography variant="p" component="div" sx={{flexGrow: 1}} align="right">
                    My Address: <Typography component="span" sx={{bgcolor: '#fff', p: '2px'}}>{gameState?.myAddress}</Typography>
                </Typography>}                
            </Toolbar>
        </AppBar>
    );
};

export default Header;