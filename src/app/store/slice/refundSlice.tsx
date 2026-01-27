import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { AxiosInstance } from "@/app/hook/axiosInstance";
import { refundDetailType, refundEntityType } from "@/app/types/refund";

export const getAllRefund = createAsyncThunk("refund/getAllRefund", async () => {
    try {
        const response = await AxiosInstance.get("/refund_service/refund");

        return { status: true, data: response.data.body };
    } catch (error: any) {
        return { status: false, error: error?.response.data.error }; 
    }
});

export const getRefundDetail = createAsyncThunk("refund/getRefundDetail", async (bookingId: string) => {
    try {
        const response = await AxiosInstance.get(`/refund_service/refund/${bookingId}`);

        return { status: true, data: response.data.body };
    } catch (error: any) {
        return { status: false, error: error?.response.data.error }; 
    }
});

export interface updateRefundProps {
    booking: string;
    refundStatus: "panding" | "refunded" | "failed"; 
};

export const updateRefund = createAsyncThunk("refund/updateRefund", async (data: updateRefundProps) => {
    try {
        const response = await AxiosInstance.put(`/refund_service/refund/${data.booking}`, {
            refundStatus: data.refundStatus
        });

        return { status: true, data: response.data.body };
    } catch (error: any) {
        return { status: false, error: error?.response.data.error }; 
    }
});

interface refundType {
    refunds: refundEntityType[] | null;
    refundDetail: refundDetailType | null;
    loading: boolean;
    error: unknown;
}

const initialState: refundType = {
    refundDetail: null,
    refunds: null,
    loading: false,
    error: null
}

const refundSlice = createSlice({
    name: 'refund',
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
                if (action.type.includes("getAllRefund")) {
                    state.refunds = action.payload.data as refundEntityType[];
                } else if (action.type.includes("getRefundDetail")) {
                    state.refundDetail = action.payload.data as refundDetailType;
                } else if (action.type.includes("updateRefund")) {
                    const refundData = action.payload.data as refundDetailType;

                    if (!state.refundDetail || !state.refunds) return;

                    state.refundDetail.refundStatus = refundData.refundStatus;
                    state.refunds = (state.refunds ?? [])
                    .map((item) => item.bookingId === refundData.bookingId ? {
                        ...item,
                        refundStatus: refundData.refundStatus,
                    } : item);
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

export default refundSlice.reducer;
export const refundSelector = (state: RootState) => state.refund;