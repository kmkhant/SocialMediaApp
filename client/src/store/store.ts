import { configureStore } from "@reduxjs/toolkit";
import postsReducer from "../features/postsSlice";
import authReducer from "../features/authSlice";
import modalReducer from "../features/modalSlice";

export const store = configureStore({
	reducer: {
		postsReducer,
		authReducer,
		modalReducer,
	},
});

// Infer the `RootState` and `AppDispatch` types from he store itself
export type RootState = ReturnType<typeof store.getState>;

// Inferred type: { posts: PostsState }
export type AppDispatch = typeof store.dispatch;

export default store;
