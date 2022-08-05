import {
	createAsyncThunk,
	createSlice,
} from "@reduxjs/toolkit";
import * as api from "../api";
import {
	ISignInForm,
	IAuthState,
	IUser,
	ISignUpForm,
} from "../types";

const initialState: IAuthState = {
	isLoading: true,
	hasError: false,
};

export const signIn = createAsyncThunk(
	"auth/signIn",
	async (thunkData: ISignInForm, thunkAPI) => {
		try {
			// get data and router
			const { data } = await api.signIn(thunkData);
			return data;
		} catch (error) {
			return thunkAPI.rejectWithValue(
				"Something Went Wrong"
			);
		}
	}
);

export const signUp = createAsyncThunk(
	"auth/signUp",
	async (thunkData: ISignUpForm, thunkAPI) => {
		try {
			// sign up process
			// console.log(thunkData);
			const { data } = await api.signUp(thunkData);
			return data;
		} catch (error) {
			return thunkAPI.rejectWithValue("Sign Up Failed");
		}
	}
);

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		signOut: (state: IAuthState) => {
			localStorage.clear();
			console.log("cleared local storage");
		},
		setNoError: (state: IAuthState) => {
			state.hasError = false;
			// console.log("ERROR RESET");
		},
	},
	extraReducers(builder) {
		builder
			.addCase(signIn.pending, (state, action) => {
				state.isLoading = true;
			})
			.addCase(signIn.fulfilled, (state, action) => {
				// set local storage
				// console.log(action);
				// state.user = action.payload;

				localStorage.setItem(
					"user",
					JSON.stringify(action.payload)
				);
				state.hasError = false;
				state.isLoading = false;
				// handle navigate
			})
			.addCase(signIn.rejected, (state, action) => {
				localStorage.clear();
				return { ...initialState };
			})
			.addCase(signUp.pending, (state, action) => {
				state.isLoading = true;
			})
			.addCase(signUp.fulfilled, (state, action) => {
				state.isLoading = false;
				state.hasError = false;
				// console.log(action);
				localStorage.setItem(
					"user",
					JSON.stringify(action.payload)
				);
			})
			.addCase(signUp.rejected, (state, action) => {
				state.hasError = true;
				console.log("REJECTED SIGNUP");
			});
	},
});

export const { signOut, setNoError } = authSlice.actions;

export default authSlice.reducer;
