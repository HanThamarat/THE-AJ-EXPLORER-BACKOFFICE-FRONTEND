import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { AxiosInstance } from "@/app/hook/axiosInstance";
import { bookingAvgEntity, bookingEntity } from "@/app/types/booking";

export const getAllBooking = createAsyncThunk("bookingSlice/getAllBooking", async () => {
    try {
        const response = await AxiosInstance.get("/booking_management/booking");

        return { status: true, data: response.data.body };
    } catch (error: any) {
        return { status: false, error: error?.response.data.error }; 
    }
});

export const getBookingAvg = createAsyncThunk('bookingSlice/getBookingAvg', async (type: 'Weekly' | 'Monthly' | 'Yearly') => {
    try {
        const response = await AxiosInstance.get(`/booking_management/booking_avg/${type}`);

        return { status: true, data: response.data.body };
    } catch (error: any) {
        return { status: false, error: error?.response.data.error }; 
    }
});

interface blogType {
    bookings: bookingEntity[] | [] | null;
    bookingAbg: bookingAvgEntity | null;
    loading: boolean;
    error: unknown;
}

const initialState: blogType = {
    bookingAbg: null,
    bookings: null,
    loading: false,
    error: null
}

const bookingSlice = createSlice({
    name: 'bookingSlice',
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
                if (action.type.includes('getAllBooking')) {
                    state.bookings = action.payload.data as bookingEntity[];
                } else if (action.type.includes('getBookingAvg')) {
                    state.bookingAbg = action.payload.data as bookingAvgEntity;
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

export default bookingSlice.reducer;
export const bookingSelector = (state: RootState) => state.booking;