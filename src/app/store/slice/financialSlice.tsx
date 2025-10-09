import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { AxiosInstance } from "@/app/hook/axiosInstance";
import { omiseFinancialEntity } from "@/app/types/financial";

export const getCurrentBalance = createAsyncThunk('financial/getCurrentBalance', async () => {
    try {
        const response = await AxiosInstance.get('/financial/balance');

        return { status: true, data: response.data.body };
    } catch (error: any) {
        return { status: false, error: error?.response.data.error };   
    }
});

interface finacialType {
    balance: omiseFinancialEntity | null;
    loading: boolean;
    error: unknown;
}

const initialState: finacialType = {
    balance: null,
    loading: false,
    error: null
}

const financialSlice = createSlice({
    name: 'financial',
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
                if (action.type.includes('getCurrentBalance')) {
                    state.balance = action.payload.data as omiseFinancialEntity;
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

export default financialSlice.reducer;
export const financialSelector = (state: RootState) => state.financial;