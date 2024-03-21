import { configureStore } from '@reduxjs/toolkit'
import playersSlice from "./playersSlice";
import etheriumSlice from "./etheriumSlice";

export const store = configureStore({
    reducer: {
        players: playersSlice,
        account: etheriumSlice,
    },
})