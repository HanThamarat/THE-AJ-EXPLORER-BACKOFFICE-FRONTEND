import { promotionDay, PromotionDTO, PromotionEntity } from "@/app/types/promotion";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { AxiosInstance } from "@/app/hook/axiosInstance";

export const getAllPromotion = createAsyncThunk('promotionSlice/getAllPromotion', async() => {
    try {
        const response = await AxiosInstance.get('/packagepromotion/promotion');

        return { status: true, data: response.data.body };
    } catch (error: any) {
        return { status: false, error: error?.response.data.error };   
    }
});

export const createNewPromotion = createAsyncThunk("promotionSlice/createNewPromotion", async (data: PromotionDTO | undefined) => {
    try {
        const response = await AxiosInstance.post('/packagepromotion/promotion', data);

        return { status: true, data: response.data.body };
    } catch (error: any) {
        return { status: false, error: error?.response.data.error };
    }
});

export const getPromotionById = createAsyncThunk("promotionSlice/getPromotionById", async (id: number) => {
    try {
        const response = await AxiosInstance.get(`/packagepromotion/promotion/${id}`);

        return { status: true, data: response.data.body };
    } catch (error: any) {
        return { status: false, error: error?.response.data.error };
    }
});

export const delPromotion = createAsyncThunk("promotionSlice/delPromotion", async (id: number) => {
    try {
        const response = await AxiosInstance.delete(`/packagepromotion/promotion/${id}`); 

        return { status: true, data: response.data.body };
    } catch (error: any) {
        return { status: false, error: error?.response.data.error };
    }
});

export interface UpdatePromoPropsType {
    id?: number;
    data?: PromotionDTO | undefined;
}

export const updatePromotion = createAsyncThunk("promotionSlice/updatePromotion", async ({id, data}: UpdatePromoPropsType) => {
    try {
        const response = await AxiosInstance.put(`/packagepromotion/promotion/${id}`, data);

        return { status: true, data: response.data.body };
    } catch (error: any) {
        return { status: false, error: error?.response.data.error };
    }
});

export const getAllPromotionday = createAsyncThunk("promotionSlice/getAllPromotionday", async () => {
    try {
        const response = await AxiosInstance.get("/packagepromotion/promotion_day");

        return { status: true, data: response.data.body };
    } catch (error: any) {
        return { status: false, error: error?.response.data.error };
    }
});


interface packageType {
    promotions: PromotionEntity[] | [] | null;
    promotion: PromotionEntity | null;
    promoDay: promotionDay[] | [] | null;
    loading: boolean;
    error: unknown;
}

const initialState: packageType = {
    promotions: null,
    promoDay: null,
    promotion: null,
    loading: false,
    error: null
}

const promotionSlice = createSlice({
    name: 'promotionSlice',
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
                if (action.type.includes("getAllPromotionday")) {
                    state.promoDay = action.payload.data as promotionDay[];
                } else if (action.type.includes('getAllPromotion')) {
                    state.promotions = action.payload.data as PromotionEntity[];
                } else if (action.type.includes('createNewPromotion')) {
                    if (action.payload.data) state.promotions = [
                        ...state?.promotions ? state.promotions : [],
                        action.payload.data as PromotionEntity
                    ];
                } else if (action.type.includes("getPromotionById")) {
                    state.promotion = action.payload.data as PromotionEntity;
                } else if (action.type.includes("delPromotion")) {
                    state.promotions = (state.promotions ?? []).filter((promo) => promo.id != action.payload.data.id);
                } else if (action.type.includes("updatePromotion")) {
                    state.promotions = (state.promotions ?? [])
                    .map((promo) => promo.id === action.payload.data.id ? action.payload.data : promo)
                    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
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

export default promotionSlice.reducer;
export const promotionSelector = (state: RootState) => state.promotion;