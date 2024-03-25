import { createSlice } from '@reduxjs/toolkit'

const gameState = JSON.parse(localStorage.getItem('gameState') || '{}');
const initialState = {
    gameState: {
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
}

export const gameSlice = createSlice({
    name: 'gameState',
    initialState: {
        ...initialState,
        ...gameState,
    },
    reducers: {
        updateGameState: (state, action) => {
            state.gameState = {
                ...state.gameState,
                ...action.payload
            }

            // localStorage.setItem('gameState', JSON.stringify(state));
        },
        clearGameState: (state, action) => {
            state.gameState = initialState.gameState
            console.log(state, 'clearGameState');
            // localStorage.setItem('gameState', JSON.stringify(state));
        },
    },
})

// Action creators are generated for each case reducer function
const updateGameState = (newState) => (dispatch) => {
    dispatch(gameSlice.actions.updateGameState(newState))

    localStorage.setItem('gameState', JSON.stringify(newState));
}

const clearGameState = (newState) => (dispatch) => {
    dispatch(gameSlice.actions.clearGameState(newState))

    localStorage.setItem('gameState', JSON.stringify(newState));
}

export { updateGameState, clearGameState }

export default gameSlice.reducer