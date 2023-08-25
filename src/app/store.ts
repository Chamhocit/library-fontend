import { configureStore } from "@reduxjs/toolkit";
import {setupListeners} from "@reduxjs/toolkit/query/react";
import { authApi } from "../services/authApi";
import { bookApi } from "../services/bookApi";
import authReducer from "../features/authSlice";
import { reviewApi } from "../services/reviewApi";
import authNameReducer from "../features/nameSlice";



export const store = configureStore({
    reducer:{
        [authApi.reducerPath]: authApi.reducer,
        [bookApi.reducerPath]: bookApi.reducer,
        [reviewApi.reducerPath]: reviewApi.reducer, 
        auth: authReducer,
        authName: authNameReducer,
    },
    middleware:(getDefaultMiddleware)=>getDefaultMiddleware().concat(authApi.middleware).concat(bookApi.middleware).concat(reviewApi.middleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
setupListeners(store.dispatch);
