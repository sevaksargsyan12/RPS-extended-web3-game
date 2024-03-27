import { useSelector } from "react-redux";
import { TextField } from "@mui/material";
import FormControl from "@mui/material/FormControl";

export default function StakeSelection({onSelect}) {
    const gameState = useSelector((state) => state.gameStateStore);
    const defaultValue = Number(gameState.stake);
    const disabled = !!gameState.contractAddress || !!gameState.txHash;

    return (
        <FormControl sx={{m: 1}} size="medium">
            <TextField
                className="stake-input"
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