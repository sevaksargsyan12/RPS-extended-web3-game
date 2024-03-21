import * as React from 'react';
import {Alert, Button, TextField, Typography} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import {useEffect, useState} from "react";
import RPS from '../contracts/RPS.json';
import Hasher from '../contracts/Hasher.json';
import {Web3} from "web3";

export default function PlayForm({player = '',move, onNewPlayer}) {

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
            //check metamask is installed
            if (!window.ethereum) {
                alert('Please download metamask');
            }
            // instantiate Web3 with the injected provider
            const web3 = new Web3(window.ethereum);

            //request user to connect accounts (Metamask will prompt)
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            //get the connected accounts
            const accounts = await web3.eth.getAccounts();
            const defaultAccount = accounts[0];
            // web3.eth.getBalance(defaultAccount).then(console.log);

            onNewPlayer(defaultAccount);

            const RPSContract = new web3.eth.Contract(RPS.abi);
            const hasherContract = new web3.eth.Contract(Hasher.abi, '0x4935C04cC2e05A20bd075046F787E81F8bB21d22');
            const moveHash = await hasherContract.methods.hash(move, '1111211').call();
console.log('moveHash -> ', moveHash);
            RPSContract.handleRevert = true;

            const contractDeployer = RPSContract.deploy({
                data: RPS.bytecode,
                arguments: [moveHash, '0xc47200Ef767Dbb077B071dF00228b29468F96672'],
            });
            const gas = await contractDeployer.estimateGas({
                from: defaultAccount,
            });
            console.log('estimated gas:', gas);

            try {
                const tx = await contractDeployer.send({
                    from: defaultAccount,
                    gas,
                    gasPrice: 10000000000,
                });
                console.log(tx, '   Contract deployed at address: ' + tx.options.address);

            } catch (error) {
                console.error(error);
            }

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