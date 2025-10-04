import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { AxiosInstance } from "@/app/hook/axiosInstance";
import { districtEntity, provinceEntiry } from "@/app/types/geolocation";

export const getAllProvinces = createAsyncThunk('geolocation/getAllProvinces', async () => {
    try {
        const response = await AxiosInstance.get('/geolocation/provinces');

        return { status: true, data: response.data.body };
    } catch (error: any) {
        return { status: false, error: error?.response.data.error };
    }
});

export const getDistrictByProId = createAsyncThunk("geolocation/getDistrictByProId", async (id: number) => {
    try {
        const response = await AxiosInstance.get(`/geolocation/district/${id}`);

        return { status: true, data: response.data.body };
    } catch (error: any) {
        return { status: false, error: error?.response.data.error };
    }
});

interface geolocationType {
    province: provinceEntiry[] | [] | null;
    district: districtEntity[] | [] | null;
    loading: boolean;
    error: unknown;
}

const initialState: geolocationType = {
    province: null,
    district: null,
    loading: false,
    error: null
}

const geolocationSlice = createSlice({
    name: 'geolocation',
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
                if (action.type.includes('getAllProvinces')) {
                    state.province = action.payload.data as provinceEntiry[];
                } else if (action.type.includes('getDistrictByProId')) {
                    state.district = action.payload.data as districtEntity[];
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

export default geolocationSlice.reducer;
export const geolocationSelector = (state: RootState) => state.geolocation;