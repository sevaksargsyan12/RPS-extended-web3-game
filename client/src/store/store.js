import { configureStore } from "@reduxjs/toolkit";
import playersSlice from "./playersSlice";
import gameSlice from "./gameSlice";

export const store = configureStore({
    reducer: {
        playersStore: playersSlice,
        gameStateStore: gameSlice,
    },
})