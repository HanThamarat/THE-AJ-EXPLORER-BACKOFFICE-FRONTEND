import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { AxiosInstance } from "@/app/hook/axiosInstance"; 
import { userEntity } from "@/app/types/user";

export const getCurrentUserInfo = createAsyncThunk("userManangement/getCurrentUserInfo", async (id) => {
    try {
        const response = await AxiosInstance.get('/usermanagement/currentuser');

        return { status: true, data: response.data.body };
    } catch (error: any) {
        return { status: false, error: error?.response.data.error.message };
    }
});

interface userType {
    userInfo: userEntity | null;
    loading: boolean;
    error: unknown;
}

const initialState: userType = {
    userInfo: null,
    loading: false,
    error: null
}

const userSlice = createSlice({
    name: 'userManangement',
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
                if (action.type.includes('getCurrentUserInfo')) {
                    state.userInfo = action.payload.data as userEntity;
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

export default userSlice.reducer;
export const userSelector = (state: RootState) => state.user;