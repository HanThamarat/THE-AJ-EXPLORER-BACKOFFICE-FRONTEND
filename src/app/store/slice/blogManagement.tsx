import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { AxiosInstance } from "@/app/hook/axiosInstance";
import { blogDTO, BlogEntitySchemaType, BlogResponseEntitySchemaType, BlogTypeEntitySchemaType } from "@/app/types/blog";

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

        return { status: true, data: response.data.body };
    } catch (error: any) {
        return { status: false, error: error?.response.data.error };
    }
});

export const createNewBlog = createAsyncThunk('blogmanagement/createNewBlog', async (data: blogDTO | undefined) => {
    try {
        const response = await AxiosInstance.post('/blogmanagement/blog', data);

        return { status: true, data: response.data.body };
    } catch (error: any) {
        return { status: false, error: error?.response.data.error };
    }
});

export const getBlogByid = createAsyncThunk('blogmanagement/getBlogByid', async (id: number) => {
    try {
        const response = await AxiosInstance.get(`/blogmanagement/blog/${id}`);

        return { status: true, data: response.data.body };
    } catch (error: any) {
        return { status: false, error: error?.response.data.error };
    }
});

export interface BlogputProps {
    id:     number;
    blog:   blogDTO | undefined;
}

export const updatingBlog = createAsyncThunk('blogmanagement/updatingBlog', async (data: BlogputProps) => {
    try {
        const response = await AxiosInstance.put(`/blogmanagement/blog/${data.id}`, data.blog);
            
     return { status: true, data: response.data.body };
    } catch (error: any) {
        return { status: false, error: error?.response.data.error };
    }
});

interface blogType {
    blogs: BlogEntitySchemaType[] | [] | null;
    blogTypes: BlogTypeEntitySchemaType[] | [] | null;
    blogById: BlogResponseEntitySchemaType | null;
    loading: boolean;
    error: unknown;
}

const initialState: blogType = {
    blogs: null,
    blogTypes: null,
    blogById: null,
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
                } else if (action.type.includes('createNewBlog')) {
                    if (action.payload.data) state.blogs = [
                        ...state?.blogs ? state.blogs : [],
                        action.payload.data as BlogEntitySchemaType
                    ];
                } else if (action.type.includes('getBlogByid')) {
                    state.blogById = action.payload.data as BlogResponseEntitySchemaType
                } else if (action.type.includes('updatingBlog')) {
                    state.blogs = (state.blogs ?? [])
                    .map((blogData) => blogData.id === action.payload.data.id ? action.payload.data : blogData)
                    .sort((a, b) =>  new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
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