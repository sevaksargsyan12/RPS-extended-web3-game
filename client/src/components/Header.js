import React from 'react';
import {AppBar, Button, Toolbar, Typography} from "@mui/material";

const Header = ({account}) => {
    return (
        <AppBar position="static" color="secondary">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                    RPS Advanced Game
                </Typography>
                <Button>Start</Button>
                <Button>Account: {account}</Button>
            </Toolbar>
        </AppBar>
    );
};

export default Header;