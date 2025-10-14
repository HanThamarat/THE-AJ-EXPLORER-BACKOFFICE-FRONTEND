import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { AxiosInstance } from "@/app/hook/axiosInstance";
import { packageBackDTO, packageEntity } from "@/app/types/package";



export const getAllPacakges = createAsyncThunk('packageManagement/getAllPacakges', async() => {
    try {
        const response = await AxiosInstance.get('/packagemanagement/package');

        return { status: true, data: response.data.body };
    } catch (error: any) {
        return { status: false, error: error?.response.data.error };
    }
});

export const createPacakage = createAsyncThunk('packageManagement/createPacakage', async(data: packageBackDTO | null) => {
    try {
        const response = await AxiosInstance.post('/packagemanagement/package', data);

        return { status: true, data: response.data.body };
    } catch (error: any) {
        return { status: false, error: error?.response.data.error };
    }
});

interface packageType {
    packages: packageEntity[] | [] | null;
    loading: boolean;
    error: unknown;
}

const initialState: packageType = {
    packages: null,
    loading: false,
    error: null
}

const packageSlice = createSlice({
    name: 'packageManagement',
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
                if (action.type.includes('getAllPacakges')) {
                    state.packages = action.payload.data as packageEntity[];
                } else if (action.type.includes('createPacakage')) {
                    if (action.payload.data) state.packages = [
                        ...state?.packages ? state.packages : [],
                        action.payload.data as packageEntity
                    ];
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

export default packageSlice.reducer;
export const packageSelector = (state: RootState) => state.package;