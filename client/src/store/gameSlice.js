import { createSlice } from '@reduxjs/toolkit';
import { getObject } from '../services/webStorage';

const gameState = getObject('RPSSLgameState');
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
            state = action.payload;
            return state;
        },
        clearGameState: (state, action) => {
            state = {
                ...initialState,
                ...(action.payload || {}),
            };
            return state;
        },
    },
})

export const { updateGameState, clearGameState } = gameSlice.actions

export default gameSlice.reducer