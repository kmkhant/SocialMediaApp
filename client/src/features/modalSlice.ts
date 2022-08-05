import { createSlice } from "@reduxjs/toolkit";

interface IModal {
	isOpen: boolean;
	isUpdateOpen: boolean;
}

const initialState: IModal = {
	isOpen: false,
	isUpdateOpen: false,
};

const modalSlice = createSlice({
	name: "modal",
	initialState,
	reducers: {
		modalOpen: (state: IModal) => {
			state.isOpen = true;
		},
		modalClose: (state: IModal) => {
			state.isOpen = false;
		},
		updateModalOpen: (state: IModal) => {
			state.isUpdateOpen = true;
		},
		updateModalClose: (state: IModal) => {
			state.isUpdateOpen = false;
		},
	},
});

export const {
	modalOpen,
	modalClose,
	updateModalOpen,
	updateModalClose,
} = modalSlice.actions;

export default modalSlice.reducer;
