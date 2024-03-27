import { createSlice } from '@reduxjs/toolkit'

const gameState = JSON.parse(localStorage.getItem('gameState') || '{}');
const initialState = {
    move: '',
    moveHash: '',
    stake: 0,
    txHash: '',
    txStatus: false,
    myAddress: '',
    accAddress1: '',
    accAddress2: '',
    contractAddress: '',
    lastAction: 0,
}

export const gameSlice = createSlice({
    name: 'gameState',
    initialState: {
        ...initialState,
        ...gameState,
    },
    reducers: {
        updateGameState: (state, action) => {
            state.move = action.payload?.move;
            state.moveHash = action.payload?.moveHash;
            state.stake = action.payload?.stake;
            state.txHash = action.payload?.txHash;
            state.txStatus = action.payload?.txStatus;
            state.myAddress = action.payload?.myAddress;
            state.accAddress1 = action.payload?.accAddress1;
            state.accAddress2 = action.payload?.accAddress2;
            state.contractAddress = action.payload?.contractAddress;
            state.lastAction = action.payload?.lastAction;
            console.log(`gameState ${JSON.stringify(state)}`);
            // localStorage.setItem('gameState', JSON.stringify(state));
            return state;
        },
        clearGameState: (state, action) => {
            state = {
                ...initialState,
            };
            localStorage.setItem('gameState', JSON.stringify(state));
            return state;
        },
    },
})

// Action creators are generated for each case reducer function
// const updateGameState = (newState) => (dispatch) => {
//     dispatch(gameSlice.actions.updateGameState(newState))

//     newState && localStorage.setItem('gameState', JSON.stringify(newState));
// }

// const clearGameState = (newState) => (dispatch) => {
//     dispatch(gameSlice.actions.clearGameState(newState))

//     newState && localStorage.setItem('gameState', JSON.stringify(newState));
// }

// export { updateGameState, clearGameState }

export const { updateGameState, clearGameState } = gameSlice.actions

export default gameSlice.reducer