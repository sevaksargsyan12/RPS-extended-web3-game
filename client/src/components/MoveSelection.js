import * as React from 'react';
import SelectBox from "../shared/components/SelectBox";
import {icons} from "../shared/icons";
import FormControl from "@mui/material/FormControl";
import {Button} from "@mui/material";

const moveItems = [
    {value: 0, label: 'Paper', icon: icons.paper},
    {value: 1, label: 'Scissors', icon: icons.scissors},
    {value: 2, label: 'Rock', icon: icons.rock},
    {value: 3, label: 'Lizard', icon: icons.lizard},
    {value: 4, label: 'Spock', icon: icons.spock},
]

export default function MoveSelection({title = 'Select move', items = moveItems, onSelect}) {
    const handleMoveSelection = (move) => {
        onSelect(move);
    };

    return (
        <>
            <FormControl sx={{m: 1, minWidth: 220}} size="medium">
                <SelectBox title={title} items={moveItems} onSelect={handleMoveSelection}/>
            </FormControl>
        </>
    );
}