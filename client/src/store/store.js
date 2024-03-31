import { configureStore } from "@reduxjs/toolkit";
import { removeObject, setObject } from '../services/webStorage';
import playersSlice from "./playersSlice";
import gameSlice from "./gameSlice";

const localStorageMiddleware = (store) => (next) => (action) => {
    if (action.type === 'gameState/updateGameState') {
        const stateData = store.getState().gameStateStore;
        
        action.payload = {
            ...stateData,
            ...(action.payload || {}),
        };

        // save in web storage
        setObject('RPSSLgameState', action.payload);
    }
    if (action.type === 'gameState/clearGameState') {
        const stateData = store.getState().gameStateStore;
        
        action.payload = {
            myAddress: stateData.myAddress,
        };
        
        // remove from web storage
        removeObject('RPSSLgameState');
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