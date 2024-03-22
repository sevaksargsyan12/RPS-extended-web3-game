import _ from 'underscore';
import * as React from 'react';
import SelectBox from "../shared/components/SelectBox";
import {icons} from "../shared/icons";
import { useSelector } from 'react-redux';
import {Box, Button, TextField} from "@mui/material";
import FormControl from "@mui/material/FormControl";

export default function PlayerSelection({onSelect}) {
    const players = useSelector((state) => state.players.players)
    // const [playerId, setPlayerId] = React.useState('');
    const playersOptions = _.uniq(players).map((p) => ({
        value: p,
        label: p,
    }));
    console.log('players ---->>> ', players)
    return (
        <FormControl sx={{m: 1, minWidth: 220}} size="medium">
            <SelectBox items={playersOptions} onSelect={onSelect}/>
        </FormControl>
    );
}