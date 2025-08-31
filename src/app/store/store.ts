import { useDispatch } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from './slice/authManagement';
import userReducer from './slice/userManagement';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();