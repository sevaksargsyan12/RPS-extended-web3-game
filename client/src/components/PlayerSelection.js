import * as React from 'react';
import SelectBox from "../shared/components/SelectBox";
import {icons} from "../shared/icons";
import {Box, Button, TextField} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import { socket } from '../socket';

export default function PlayerSelection({onSelect}) {
    const [playerId, setPlayerId] = React.useState('');
    
    return (
        <FormControl sx={{m: 1, minWidth: 220}} size="medium">
            <TextField variant='outlined' onChange={(e) => setPlayerId(e.target.value)} label="Select Player"/>
            <br />
            <Button onClick={() => onSelect(playerId)}>Select</Button>
        </FormControl>
    );
}