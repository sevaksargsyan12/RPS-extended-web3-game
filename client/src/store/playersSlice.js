import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    players: [],
}

export const playersSlice = createSlice({
    name: 'players',
    initialState,
    reducers: {
        setPlayers: (state, action) => {
            state.players = action.payload;
        },
    },
})

// Action creators are generated for each case reducer function
export const { setPlayers } = playersSlice.actions

export default playersSlice.reducer