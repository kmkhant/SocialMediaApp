import {
	createSlice,
	createAsyncThunk,
} from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { IPost, ISearchQuery } from "../types";
import * as api from "../api";
import _ from "lodash";

type PostStateType = {
	posts: IPost[];
	isLoading: boolean;
	currentPage: number;
	numberOfPages: number;
	post: IPost | null;
};

const initialState: PostStateType = {
	posts: [],
	isLoading: true,
	currentPage: 0,
	numberOfPages: 8,
	post: null,
};

export const getPost = createAsyncThunk(
	"posts/getPost",
	async (id: string, thunkAPI) => {
		try {
			const { data } = await api.fetchPost(id);
			// console.log(data);
			return data;
		} catch (error) {
			// console.log("ERROR occurred during getPost");
			return thunkAPI.rejectWithValue(
				"Error fetching post detail"
			);
		}
	}
);

export const getAllPosts = createAsyncThunk(
	"posts/getAllPosts",
	async (_, thunkAPI) => {
		try {
			const resp = await api.fetchAllPost();

			return resp.data.data;
		} catch (error) {
			return thunkAPI.rejectWithValue(
				"error fetching posts"
			);
		}
	}
);

export const getPostsBySearch = createAsyncThunk(
	"posts/getPostsBySearch",
	async (searchQuery: ISearchQuery, thunkAPI) => {
		try {
			const resp = await api.fetchPostsBySearch(
				searchQuery
			);
			return resp.data.data;
		} catch (error) {
			console.log("Something went wrong with search");
		}
	}
);

export const getPosts = createAsyncThunk(
	"posts/getPosts",
	async (page: number, thunkAPI) => {
		try {
			const resp = await axios(
				`http://localhost:5000/posts?page=${page}`
			);
			return resp.data;
		} catch (error) {
			return thunkAPI.rejectWithValue(
				"something went wrong"
			);
		}
	}
);

export const getPostsByCreator = createAsyncThunk(
	"posts/getPostsByCreator",
	async (name: string | undefined, thunkAPI) => {
		try {
			if (!name) throw Error;
			const resp = await api.fetchPostsByCreator(name);
			console.log(resp.data);
			return resp.data.data;
		} catch (error) {
			return thunkAPI.rejectWithValue(
				"Something went wrong"
			);
		}
	}
);

export const deletePostById = createAsyncThunk(
	"posts/deletePostById",
	async (id: string, { rejectWithValue }) => {
		try {
			if (!id) throw Error;
			const resp = await api.deletePost(id);
			// console.log(resp.data);
			return resp.data.data;
		} catch (error) {
			if (axios.isAxiosError(error)) {
				if (error.response?.status === 401)
					return rejectWithValue("You need to login first");
			}
			return rejectWithValue("Something went wrong...");
		}
	}
);

interface IComment {
	id: string;
	value: string;
}

export const commentPostById = createAsyncThunk(
	"posts/commentPostById",
	async (data: IComment, { rejectWithValue }) => {
		try {
			if (!data.id) {
				return rejectWithValue("No id applied");
			}

			const resp = await api.comment(data.value, data.id);

			return resp.data;
		} catch (error) {
			console.log(error);
			return rejectWithValue("Error Commenting Post");
		}
	}
);

const postsSlice = createSlice({
	name: "posts",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			// getPosts Reducers
			.addCase(getPosts.pending, (state, action) => {
				state.isLoading = true;
			})
			.addCase(getPosts.fulfilled, (state, action) => {
				state.isLoading = false;
				state.posts = action.payload.data;
				state.currentPage = action.payload.currentPage;
				state.numberOfPages = action.payload.numberOfPages;
			})
			.addCase(getPosts.rejected, (state, action) => {
				state.isLoading = false;
			})
			// getPost Reducers
			.addCase(getPost.pending, (state, action) => {
				state.isLoading = true;
			})
			.addCase(getPost.fulfilled, (state, action) => {
				// console.log("getPost FULFILED");
				state.post = action.payload;
				state.isLoading = false;
			})
			.addCase(getPost.rejected, (state, action) => {
				state.isLoading = false;
				console.log("getPost Rejected");
			})
			// getAllPosts Reducers
			.addCase(getAllPosts.fulfilled, (state, action) => {
				state.posts = action.payload;
			})
			.addCase(getAllPosts.rejected, (state, action) => {
				console.log("REJECTED GET ALL POSTS");
			})
			// getPostsBySearch Reducers
			.addCase(
				getPostsBySearch.pending,
				(state, action) => {
					state.isLoading = true;
				}
			)
			.addCase(
				getPostsBySearch.fulfilled,
				(state, action) => {
					state.posts = action.payload;
					state.isLoading = false;
				}
			)
			.addCase(
				getPostsBySearch.rejected,
				(state, action) => {
					state.isLoading = false;
				}
			)
			// getPostsByCreator Reducer
			.addCase(
				getPostsByCreator.pending,
				(state, action) => {
					state.isLoading = true;
				}
			)
			.addCase(
				getPostsByCreator.fulfilled,
				(state, action) => {
					state.isLoading = false;
					state.posts = action.payload;
				}
			)
			.addCase(
				getPostsByCreator.rejected,
				(state, action) => {
					state.isLoading = false;
				}
			)
			// deletePostById reducer
			.addCase(
				deletePostById.fulfilled,
				(state, action) => {
					// delete success
				}
			)
			.addCase(deletePostById.rejected, (state, action) => {
				// delete fail
			})
			.addCase(
				commentPostById.fulfilled,
				(state, action) => {
					// comment success
					state.post = action.payload;
				}
			)
			.addCase(
				commentPostById.rejected,
				(state, action) => {
					// comment fail
				}
			);
	},
});

// export action
export const {} = postsSlice.actions;
// export reducer
export default postsSlice.reducer;
