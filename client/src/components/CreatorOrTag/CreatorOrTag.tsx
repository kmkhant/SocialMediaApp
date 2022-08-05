import React, { useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import {
	Typography,
	CircularProgress,
	Grid,
	Divider,
} from "@mui/material";
import {
	useAppDispatch,
	useAppSelector,
} from "../../hooks/hooks";

import Post from "../Posts/Post/Post";
// import getPosts By Creator and getPostsBySearch
import {
	getPostsByCreator,
	getPostsBySearch,
} from "../../features/postsSlice";

const CreatorOrTag = () => {
	const { name } = useParams();
	const dispatch = useAppDispatch();

	const { posts, isLoading } = useAppSelector(
		(state) => state.postsReducer
	);

	const location = useLocation();

	useEffect(() => {
		if (location.pathname.startsWith("/tags")) {
			dispatch(
				getPostsBySearch({ search: "none", tags: name })
			);
		} else {
			dispatch(getPostsByCreator(name));
		}
	}, []);

	if (!posts.length && !isLoading) return <p>"No posts"</p>;

	return (
		<div>
			<Typography variant="h2">
				{location.pathname.startsWith("/tags") && (
					<span>#</span>
				)}
				{name}
			</Typography>
			<Divider style={{ margin: "20px 0 50px 0" }} />
			{isLoading ? (
				<CircularProgress />
			) : (
				<Grid container alignItems="stretch" spacing={3}>
					{posts.map((post) => (
						<Grid
							key={post._id}
							item
							xs={12}
							sm={12}
							md={6}
							lg={3}
						>
							<Post post={post} />
						</Grid>
					))}
				</Grid>
			)}
		</div>
	);
};

export default CreatorOrTag;
