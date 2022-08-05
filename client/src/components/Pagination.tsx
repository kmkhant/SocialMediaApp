import React, { useEffect } from "react";
import {
	useAppDispatch,
	useAppSelector,
} from "../hooks/hooks";
import { Pagination, PaginationItem } from "@mui/material";
import { Link } from "react-router-dom";
import { getPosts } from "../features/postsSlice";

type PaginateProps = {
	page: number;
};

const Paginate: React.FC<PaginateProps> = ({ page }) => {
	const { numberOfPages } = useAppSelector(
		(state) => state.postsReducer
	);

	const dispatch = useAppDispatch();

	useEffect(() => {
		if (page) dispatch(getPosts(page));
	}, [dispatch, page]);

	return (
		<Pagination
			count={numberOfPages}
			page={Number(page) || 1}
			variant="outlined"
			color="primary"
			renderItem={(item) => (
				<PaginationItem
					{...item}
					component={Link}
					to={`/posts?page=${item.page}`}
				/>
			)}
		/>
	);
};

export default Paginate;
