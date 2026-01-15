import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { AxiosInstance } from "@/app/hook/axiosInstance";
import { bookingAvgEntity, bookingEntity, bookingDetailEntityType } from "@/app/types/booking";

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

export const findBookingDetail = createAsyncThunk("bookingSlice/findBookingDetail", async (bookingId: string) => {
    try {
        const response = await AxiosInstance.get(`/booking_management/booking_detail/${bookingId}`);

        return { status: true, data: response.data.body };
    } catch (error: any) {
        return { status: false, error: error?.response.data.error }; 
    }
});

export interface updateBookingStatusProps {
    bookingId: string;
    bookingStatus: "confirmed" | "panding" | "failed";
}

export const updateBookingStatus = createAsyncThunk("bookingSlice/updateBookingStatus", async (data: updateBookingStatusProps) => {
    try {
        const response = await AxiosInstance.put(`/booking_management/update_booking_status/${data.bookingId}/${data.bookingStatus}`);

        return { status: true, data: response.data.body };
    } catch (error: any) {
        return { status: false, error: error?.response.data.error };
    }
});

interface blogType {
    bookings: bookingEntity[] | [] | null;
    bookingAbg: bookingAvgEntity | null;
    bookingDetail: bookingDetailEntityType | null;
    loading: boolean;
    error: unknown;
}

const initialState: blogType = {
    bookingAbg: null,
    bookings: null,
    bookingDetail: null,
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
                } else if (action.type.includes('findBookingDetail')) {
                    state.bookingDetail = action.payload.data as bookingDetailEntityType;
                } else if (action.type.includes("updateBookingStatus")) {
                    state.bookingDetail = action.payload.data as bookingDetailEntityType;
                    const bookingData = action.payload.data as bookingDetailEntityType;
                    if (!bookingData) return;
                    state.bookings = (state.bookings ?? [])
                    .map((item) => item.bookingId === bookingData.bookingId ? 
                    {
                        ...item,
                        bookingStatus: bookingData.bookingStatus as "panding" | "confirmed" | "failed"
                    }
                    : item);
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