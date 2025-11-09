import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { AxiosInstance } from "@/app/hook/axiosInstance";
import { BlogEntitySchemaType, BlogTypeEntitySchemaType } from "@/app/types/blog";

export const getAllblogType = createAsyncThunk('blogManagement/getAllblogType', async () => {
    try {
        const response = await AxiosInstance.get('/blogmanagement/blog_type');

        return { status: true, data: response.data.body };
    } catch (error: any) {
        return { status: false, error: error?.response.data.error };
    }
});

export const getAllBlogs = createAsyncThunk('blogmanagement/getAllBlogs', async () => {
    try {
        const response = await AxiosInstance.get('/blogmanagement/blog');

        return { status: true, data: response.data.body }
    } catch (error: any) {
        return { status: false, error: error?.response.data.error };
    }
});

interface blogType {
    blogs: BlogEntitySchemaType[] | [] | null;
    blogTypes: BlogTypeEntitySchemaType[] | [] | null;
    loading: boolean;
    error: unknown;
}

const initialState: blogType = {
    blogs: null,
    blogTypes: null,
    loading: false,
    error: null
}

const blogSlice = createSlice({
    name: 'blogManagement',
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
                if (action.type.includes('getAllblogType')) {
                    state.blogTypes = action.payload.data as BlogTypeEntitySchemaType[];
                } else if (action.type.includes('getAllBlogs')) {
                    state.blogs = action.payload.data as BlogEntitySchemaType[];
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

export default blogSlice.reducer;
export const blogSelector = (state: RootState) => state.blog;