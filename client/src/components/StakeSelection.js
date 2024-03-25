import { useSelector } from "react-redux";
import { TextField } from "@mui/material";
import FormControl from "@mui/material/FormControl";

export default function StakeSelection({onSelect}) {
    const gameState = useSelector((state) => state.gameState);
    const disabled = !!gameState.contractAddress || !!gameState.txHash;
    const defaultValue = gameState.stake;
    console.log(disabled);
    return (
        <FormControl sx={{m: 1, minWidth: 220}} size="medium">
            <TextField
                variant="outlined"
                type="number"
                onChange={(e) => onSelect(e.target.value)}
                label="Select Stake"
                defaultValue={defaultValue}
                disabled={disabled}
                />
        </FormControl>     
    );
}