import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { AxiosInstance } from "@/app/hook/axiosInstance"; 

export const signIn = createAsyncThunk('authMenagement/signIn', async (data: credentialType) => {
    try {
        const response = await AxiosInstance.post('/auth/signin', {
            username: data.username,
            password: data.password
        });

        return { status: true, data: response.data.body };
    } catch (error: any) {
        return { status: false, error: error?.response.data.error.message };
    }
});

interface credentialType {
    username: string;
    password: string;
}

interface authType {
    userInfo: [];
    loading: boolean;
    error: unknown;
}
  
const initialState: authType = {
    userInfo: [],
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'authMenagement',
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addMatcher(
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
                if (action.type.includes('signIn')) {
                    state.userInfo = action.payload.data;
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
    }
});

export default authSlice.reducer;
export const authSelector = (state:RootState) => state.auth;