import React, { FC, useEffect } from "react";
import Post from "./Post/Post";
import { Grid, CircularProgress } from "@mui/material";
import {
	useAppDispatch,
	useAppSelector,
} from "../../hooks/hooks";
import { useQuery } from "../../hooks/utilHooks";
import { getPosts } from "../../features/postsSlice";
type PostsProps = {
	setCurrentId: React.Dispatch<
		React.SetStateAction<string>
	>;
};

const Posts: FC<PostsProps> = ({ setCurrentId }) => {
	const { posts, isLoading } = useAppSelector(
		(state) => state.postsReducer
	);

	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(getPosts(1));
		// console.log("REBUILT");
	}, []);

	if (!posts.length && !isLoading) return <p>No Posts</p>;

	return !posts.length ? (
		<CircularProgress />
	) : (
		<Grid container alignItems="stretch" spacing={3}>
			{posts.map((post) => (
				<Grid key={post._id.toString()} item xs={12} sm={6}>
					<Post post={post} setCurrentId={setCurrentId} />
				</Grid>
			))}
		</Grid>
	);
};

export default Posts;
