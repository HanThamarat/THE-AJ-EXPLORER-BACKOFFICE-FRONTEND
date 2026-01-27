import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { AxiosInstance } from "@/app/hook/axiosInstance";
import { cancelDetailEntityType, cancelEntityType } from "@/app/types/cancel";

export const getAllCancel = createAsyncThunk("cancel/getAllCancel", async () => {
    try {
        const response = await AxiosInstance.get("/cancel_service/cancel");

        return { status: true, data: response.data.body };
    } catch (error: any) {
        return { status: false, error: error?.response.data.error }; 
    }
});

export const getCancelDetail = createAsyncThunk("cancel/getCancelDetail", async (bookingId: string) => {
    try {
        const response = await AxiosInstance.get(`/cancel_service/cancel/${bookingId}`);

        return { status: true, data: response.data.body };
    } catch (error: any) {
        return { status: false, error: error?.response.data.error }; 
    }
});

export interface updateCancelProps {
    bookingId: string;
    cancelStatus: "panding" | "confirmed" | "failed";
}

export const updateCancel = createAsyncThunk("cancel/updateCancel", async (data: updateCancelProps) => {
    try {
        const response = await AxiosInstance.put(`/cancel_service/cancel/${data.bookingId}`, {
            cancelStatus: data.cancelStatus
        });

        return { status: true, data: response.data.body };
    } catch (error: any) {
        return { status: false, error: error?.response.data.error }; 
    }
});

interface cancelType {
    cancels: cancelEntityType[] | null;
    cancelDetail: cancelDetailEntityType | null;
    loading: boolean;
    error: unknown;
}

const initialState: cancelType = {
    cancels: null,
    cancelDetail: null,
    loading: false,
    error: null
}

const cancelSlice = createSlice({
    name: 'cancel',
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
                if (action.type.includes("getAllCancel")) {
                    state.cancels = action.payload.data as cancelEntityType[];
                } else if (action.type.includes("getCancelDetail")) {
                    state.cancelDetail = action.payload.data as cancelDetailEntityType;
                } else if (action.type.includes("updateCancel")) {
                    const currentUpdateData = action.payload.data as cancelEntityType;
                    
                    if (!currentUpdateData || !state.cancelDetail) return;

                    state.cancelDetail.cancelStatus = currentUpdateData.cancelStatus;
                    state.cancels = (state.cancels ?? [])
                    .map((item) => item.bookingId === currentUpdateData.bookingId ? {
                        ...item,
                        cancelStatus:  currentUpdateData.cancelStatus
                    }: item);
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

export default cancelSlice.reducer;
export const cancelSelector = (state: RootState) => state.cancel;