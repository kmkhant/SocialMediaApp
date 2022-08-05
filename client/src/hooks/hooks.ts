import {
	TypedUseSelectorHook,
	useDispatch,
	useSelector,
} from "react-redux";
import type {
	RootState,
	AppDispatch,
} from "../store/store";
import type {} from "redux-thunk/extend-redux";

// Use throughout app
export const useAppDispatch: () => AppDispatch =
	useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> =
	useSelector;
