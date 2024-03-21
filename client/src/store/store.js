import { configureStore } from '@reduxjs/toolkit'
import etheriumSlice from "./etheriumSlice";

export const store = configureStore({
    reducer: {
        account: etheriumSlice
    },
})