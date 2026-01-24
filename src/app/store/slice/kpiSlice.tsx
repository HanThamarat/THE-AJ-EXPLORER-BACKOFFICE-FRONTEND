import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { AxiosInstance } from "@/app/hook/axiosInstance";
import { overviewEntityType, popularProviceType, qtyEntityType } from "@/app/types/kpi";
import { bookingAvgDataType } from "@/app/types/booking";

export const getCurrentTotalBooking = createAsyncThunk("kpi/getCurrentTotalBooking", async () => {
    try {
        const response = await AxiosInstance.get('/kpi_service/booking_qty');

        return { status: true, data: response.data.body };
    } catch (error: any) {
        return { status: false, error: error?.response.data.error };  
    }
});

export const getCurrentTotalPackage = createAsyncThunk("kpi/getCurrentTotalPackage", async () => {
    try {
        const response = await AxiosInstance.get('/kpi_service/package_qty');

        return { status: true, data: response.data.body };
    } catch (error: any) {
        return { status: false, error: error?.response.data.error };  
    }
});

export const getBookingOverview = createAsyncThunk("kpi/getBookingOverview", async () => {
    try {
        const response = await AxiosInstance.get('/kpi_service/booking_overview');

        return { status: true, data: response.data.body };
    } catch (error: any) {
        return { status: false, error: error?.response.data.error };  
    }
});

export const getTotalIncome = createAsyncThunk("kpi/getTotalIncome", async () => {
    try {
        const response = await AxiosInstance.get('/kpi_service/total_income');

        return { status: true, data: response.data.body };
    } catch (error: any) {
        return { status: false, error: error?.response.data.error };  
    }
});

export const getPopularProvince = createAsyncThunk("kpi/getPopularProvince", async () => {
    try {
        const response = await AxiosInstance.get('/kpi_service/popular_province');

        return { status: true, data: response.data.body };
    } catch (error: any) {
        return { status: false, error: error?.response.data.error };  
    }
});

interface kpiType {
    totalBooking: qtyEntityType | null;
    totalPackage: qtyEntityType | null;
    bookOverview: overviewEntityType[] | null;
    popolarProvince: popularProviceType[] | null;
    totalIncome: bookingAvgDataType[] | null;
    loading: boolean;
    error: unknown;
}

const initialState: kpiType = {
    popolarProvince: null,
    totalBooking: null,
    totalPackage: null,
    bookOverview: null,
    totalIncome: null,
    loading: false,
    error: null
}

const kpiSlice = createSlice({
    name: 'kpi',
    initialState: initialState,
    reducers: {},
    extraReducers(builder) {
        builder.addMatcher(
            (action) => action.type.endsWith("/pending"),
            (state) => {
                state.loading = true;
                state.error = null;
            },
        )
        .addMatcher(
            (action) => action.type.endsWith("/fulfilled"),
            (state, action: PayloadAction<{ data?: any }>) => {
                state.loading = false;
                if (action.type.includes("getCurrentTotalBooking")) {
                    state.totalBooking = action.payload.data as qtyEntityType;
                } else if (action.type.includes("getCurrentTotalPackage")) {
                    state.totalPackage = action.payload.data as qtyEntityType;
                } else if (action.type.includes("getBookingOverview")) {
                    state.bookOverview = action.payload.data as overviewEntityType[];
                } else if (action.type.includes("getTotalIncome")) {
                    state.totalIncome = action.payload.data as bookingAvgDataType[];
                } else if (action.type.includes("getPopularProvince")) {
                    state.popolarProvince = action.payload.data as popularProviceType[];
                }
            }
        )
        .addMatcher(
            (action) => action.type.endsWith("/rejected"),
            (state, action: PayloadAction) => {
                state.loading = false;
                state.error = action.payload;
            }
        )
    },
});

export default kpiSlice.reducer;
export const kpiSelector = (state: RootState) => state.kpi;