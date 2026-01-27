import { useDispatch } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from './slice/authManagement';
import userReducer from './slice/userManagement';
import pkgReducer from './slice/packageManagement';
import pkgTypeReducer from './slice/pkgTypeManangementSlice';
import geolocationReducer from "./slice/geolocationSlice";
import financialReducer from "./slice/financialSlice";
import promotionReducer from "./slice/promotionSlice";
import blogReducer from "./slice/blogManagement";
import bookingReducer from "./slice/bookingSlice";
import kpiReducer from "./slice/kpiSlice";
import cancelReducer from "./slice/cancelSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer,
        package: pkgReducer,
        pkgType: pkgTypeReducer,
        geolocation: geolocationReducer,
        financial: financialReducer,
        promotion: promotionReducer,
        blog: blogReducer,
        booking: bookingReducer,
        kpi: kpiReducer,
        cancel: cancelReducer,
    },
    devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();