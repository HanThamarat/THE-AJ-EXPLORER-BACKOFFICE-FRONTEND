import { useDispatch } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from './slice/authManagement';
import userReducer from './slice/userManagement';
import pkgReducer from './slice/packageManagement';
import pkgTypeReducer from './slice/pkgTypeManangementSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer,
        package: pkgReducer,
        pkgType: pkgTypeReducer,
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();