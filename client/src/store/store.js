import { configureStore } from "@reduxjs/toolkit";
import playersSlice from "./playersSlice";
import gameSlice from "./gameSlice";

const localStorageMiddleware = (store) => (next) => (action) => {
    if (action.type === 'gameState/updateGameState') {
        console.log(action);
        console.log(store.getState().gameStateStore);
        const stateData = store.getState().gameStateStore;
        action.payload = {
            ...stateData,
            ...(action.payload || {}),
        };
        // check action, depends on it update localstorage in some logic
        localStorage.setItem('gameState', JSON.stringify(action.payload));
        //
    }
    return next(action);
};

export const store = configureStore({
    reducer: {
        playersStore: playersSlice,
        gameStateStore: gameSlice,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(localStorageMiddleware)
})