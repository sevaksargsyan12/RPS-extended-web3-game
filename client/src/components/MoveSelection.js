import * as React from 'react';
import { useSelector } from 'react-redux';
import SelectBox from "../shared/components/SelectBox";
import {icons} from "../shared/icons";
import FormControl from "@mui/material/FormControl";

const moveItems = [
    {value: 2, label: 'Paper', icon: icons.paper},
    {value: 3, label: 'Scissors', icon: icons.scissors},
    {value: 1, label: 'Rock', icon: icons.rock},
    {value: 5, label: 'Lizard', icon: icons.lizard},
    {value: 4, label: 'Spock', icon: icons.spock},
]

export default function MoveSelection({title = 'Select move', items = moveItems, onSelect}) {
    const gameState = useSelector((state) => state.gameState);
    const disabled = !!gameState.txHash;
    const defaultValue = gameState.move;
    
    return (
        <>
            <FormControl sx={{m: 1, minWidth: 220}} size="medium" disabled={disabled}>
                <SelectBox title={title} items={moveItems} onSelect={onSelect} defaultValue={defaultValue}/>
            </FormControl>
        </>
    );
}