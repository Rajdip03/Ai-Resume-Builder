import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";

export const store = configureStore({ // create the redux store 
    reducer: { // add reducer for to know How should state change when an action is dispatched?.
        auth: authReducer, // create a state section which is---> state.auth
    }
})