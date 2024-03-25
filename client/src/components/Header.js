import React from 'react';
import { useSelector } from 'react-redux';
import { AppBar, Toolbar, Typography } from "@mui/material";

const Header = ({account}) => {
    const gameState = useSelector((state) => state.gameState);
    let message;
    if (gameState.txHash && !gameState.txStatus) {
        message = 'Waiting for transaction confirmation...';
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