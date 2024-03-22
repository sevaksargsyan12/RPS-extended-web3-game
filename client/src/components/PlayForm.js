import * as React from 'react';
import {Alert, Button, TextField, Typography} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import {useEffect, useState} from "react";

export default function PlayForm({player = '',move, onNewPlay}) {

    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [disableButton, setDisable] = useState(true);

    useEffect(() => {
        if(move !== undefined && move !=='' && player) {
            setDisable(false);
        } else {
            setDisable(true);
        }
    },[player,move])

    console.log('B URL',process.env.BACKEND_URL, !(!!move && !!player));
    const play = async () => {

        try {
            onNewPlay()

            // setSuccessMessage(contactData.data?.message);
            setErrorMessage('');
        } catch (e) {
            console.log('ERRORRRR -- ', e);
            setSuccessMessage('');
            setErrorMessage('Something went wrong.');
        }
    };

    return (
        <FormControl sx={{m: 1, minWidth: 220}} size="medium">
            <Typography component='h3'>Player: {player}</Typography>
            <Typography component='h3'>Move: {move}</Typography>
            <br />
            <Button variant='btn-success' sx={{bgcolor: 'green' , color: '#fff'}} onClick={play}>Play</Button>
            <br/>
            {successMessage && <Alert severity="success">{successMessage}</Alert>}
            {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        </FormControl>
    );
}