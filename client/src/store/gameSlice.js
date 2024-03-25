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
            state = {
                ...state,
                ...(action.payload || {}),
            };
            localStorage.setItem('gameState', JSON.stringify(state));
        },
        clearGameState: (state, action) => {
            state = {
                ...initialState,
            };
            console.log(state, 'clearGameState');
            localStorage.setItem('gameState', JSON.stringify(state));
        },
    },
})

// Action creators are generated for each case reducer function
export const { updateGameState, clearGameState } = gameSlice.actions

export default gameSlice.reducer