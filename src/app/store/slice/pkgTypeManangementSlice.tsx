import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { AxiosInstance } from "@/app/hook/axiosInstance";
import { packageTypeDTO, packageTypeEntity } from "@/app/types/package";

export const getAllPkgType = createAsyncThunk('pkgTypeManagement/getAllPkgType', async () => {
    try {
        const response = await AxiosInstance.get('/pkgtypemanagement/pkgtype');

        return { status: true, data: response.data.body };
    } catch (error: any) {
        return { status: false, error: error?.response.data.error };     
    }
});

export const getPkgTypeById = createAsyncThunk('pkgTypeManagement/getPkgTypeById', async (id: number) => {
    try {
        const response = await AxiosInstance.get(`/pkgtypemanagement/pkgtype/${id}`);

        return { status: true, data: response.data.body };
    } catch (error: any) {
        return { status: false, error: error?.response.data.error };
    }
});

export const createPkgType = createAsyncThunk('pkgTypeManagement/createPkgType', async (data: packageTypeDTO) => {
    try {
        const response = await AxiosInstance.post('/pkgtypemanagement/pkgtype', data);

        return { status: true, data: response.data.body };
    } catch (error: any) {
        return { status: false, error: error?.response.data.error };     
    }
});

export interface updatePkgTypeProps {
    id: number;
    data: packageTypeDTO;
}

export const updatePkgType = createAsyncThunk('pkgTypeManagement/updatePkgType', async ({ id, data }: updatePkgTypeProps) => {
    try {
        const response = await AxiosInstance.put(`/pkgtypemanagement/pkgtype/${id}`, data);

        return { status: true, data: response.data.body };
    } catch (error: any) {
        return { status: false, error: error?.response.data.error };
    }
});

export const deletePkgType = createAsyncThunk('pkgTypeManagement/deletePkgType', async (id: number) => {
     try {
        const response = await AxiosInstance.delete(`/pkgtypemanagement/pkgtype/${id}`);

        return { status: true, data: response.data.body };
    } catch (error: any) {
        return { status: false, error: error?.response.data.error };
    }
});

interface packageType {
    pkgTypes: packageTypeEntity[] | [] | null;
    pkgTypeInfo: packageTypeEntity | null;
    loading: boolean;
    error: unknown;
}

const initialState: packageType = {
    pkgTypes: null,
    pkgTypeInfo: null,
    loading: false,
    error: null
}

const pkgTypeSlice = createSlice({
    name: 'pkgTypeManagement',
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
                if (action.type.includes('getAllPkgType')) {
                    state.pkgTypes = action.payload.data as packageTypeEntity[];
                } else if (action.type.includes('createPkgType')) {
                    if (action.payload.data) state.pkgTypes = [
                        ...state?.pkgTypes ? state.pkgTypes : [], 
                        action.payload.data as packageTypeEntity
                    ];
                } else if (action.type.includes('getPkgTypeById')) {
                    state.pkgTypeInfo = action.payload.data;
                } else if (action.type.includes('updatePkgType')) {
                    state.pkgTypes = (state.pkgTypes ?? [])
                    .map((pkgTypes) => pkgTypes.id === action.payload.data.id ? action.payload.data : pkgTypes)
                    .sort((a, b) =>  new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
                } else if (action.type.includes('deletePkgType')) {
                    state.pkgTypes = (state.pkgTypes ?? []).filter((pkgTypes) => pkgTypes.id !== action.payload.data.id);
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

export default pkgTypeSlice.reducer;
export const pkgTypeSelector = (state: RootState) => state.pkgType;