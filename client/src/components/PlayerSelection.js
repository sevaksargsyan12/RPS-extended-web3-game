import _ from "underscore";
import {useSelector} from "react-redux";
import FormControl from "@mui/material/FormControl";
import SelectBox from "../shared/components/SelectBox";

export default function PlayerSelection({onSelect}) {
    const players = useSelector((state) => state.playersStore.players)
    const gameState = useSelector((state) => state.gameStateStore);
    const playersOptions = _.uniq(players).filter(p => p !== gameState.myAddress).map((p) => ({
        value: p,
        label: p,
    }));
    const disabled = !!gameState.contractAddress || !!gameState.txHash;
    const defaultValue = gameState.myAddress === gameState.accAddress2 ?
                gameState.accAddress1 : gameState.accAddress2;
    return (
        <FormControl sx={{m: 1, minWidth: 220}} size="medium" disabled={disabled}>
            <SelectBox items={playersOptions} onSelect={onSelect} defaultValue={defaultValue}/>
        </FormControl>
    );
}