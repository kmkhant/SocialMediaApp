import React, { FC, useEffect, useState } from "react";
import {
	Card,
	CardActions,
	CardContent,
	CardMedia,
	Button,
	Typography,
	Box,
} from "@mui/material";
import ThumbAltIcon from "@mui/icons-material/ThumbUpAlt";
import DeleteIcon from "@mui/icons-material/Delete";
import moment from "moment";
import { IPost } from "../../../types";
import { likePost } from "../../../api";
import {
	useAppDispatch,
	useAppSelector,
} from "../../../hooks/hooks";
import { useQuery } from "../../../hooks/utilHooks";
import { toast } from "react-toastify";
import {
	deletePostById,
	getPosts,
} from "../../../features/postsSlice";
import { AxiosResponse, AxiosError } from "axios";

// import actions

type PostProps = {
	post: IPost;
	setCurrentId?: React.Dispatch<
		React.SetStateAction<string>
	>;
};

const Post: FC<PostProps> = ({ post, setCurrentId }) => {
	const dispatch = useAppDispatch();
	const [currentPost, setCurrentPost] = useState(post);

	const query = useQuery();

	const page = Number(query.get("page")) || 1;

	const handleLikePost = () => {
		likePost(post._id)
			.then((resp) => {
				setCurrentPost(resp.data.updatedPost);
				if (resp.data.isLiked) {
					toast.success("You just liked post", {
						position: "top-right",
						autoClose: 5000,
						hideProgressBar: false,
						closeOnClick: true,
						pauseOnHover: true,
						draggable: true,
						progress: undefined,
					});
				} else {
					toast.success("You unliked post", {
						position: "top-right",
						autoClose: 5000,
						hideProgressBar: false,
						closeOnClick: true,
						pauseOnHover: true,
						draggable: true,
						progress: undefined,
					});
				}
			})
			.catch((error) => {
				if (error.response.status === 401) {
					toast.error("You need to login first...", {
						position: "top-right",
						autoClose: 5000,
						hideProgressBar: false,
						closeOnClick: true,
						pauseOnHover: true,
						draggable: true,
						progress: undefined,
					});
				} else {
					toast.error("Something went wrong", {
						position: "top-right",
						autoClose: 5000,
						hideProgressBar: false,
						closeOnClick: true,
						pauseOnHover: true,
						draggable: true,
						progress: undefined,
					});
				}
			});
	};

	const handleDelete = () => {
		dispatch(deletePostById(currentPost._id))
			.unwrap()
			.then((resp) => {
				// delete success
				toast.success("Post has been deleted", {
					position: "top-right",
					autoClose: 5000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
				});
				dispatch(getPosts(page));
			})
			.catch((err) => {
				// got error
				toast.error("You need to login first...", {
					position: "top-right",
					autoClose: 5000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
				});
			});
	};

	return (
		<Card
			sx={{
				display: "flex",
				flexDirection: "column",
				justifyContent: "space-between",
				borderRadius: "15px",
				height: "100%",
				position: "relative",
			}}
		>
			<a href={`/posts/${post._id}`}>
				<CardMedia
					sx={{
						height: 0,
						paddingTop: "56.25%",
						backgroundColor: "rgba(0,0,0,0.5)",
						backgroundBlendMode: "darken",
					}}
					image={
						post.selectedFile ||
						"https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png"
					}
					title={post.title}
				/>
			</a>
			<Box
				sx={{
					position: "absolute",
					top: "20px",
					right: "20px",
					color: "white",
				}}
			>
				<Typography variant="h6">{post.creator}</Typography>
				<Typography variant="body2">
					{moment(post.createdAt).fromNow()}
				</Typography>
			</Box>
			<Box
				sx={{
					position: "absolute",
					top: "20px",
					right: "20px",
					color: "red",
				}}
			>
				<Button
					sx={{ color: "green" }}
					size="small"
					onClick={() => {
						/* setCurrentId(post._id.toString())  */
					}}
				></Button>
			</Box>
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
					margin: "20px",
				}}
			>
				<Typography
					variant="body2"
					color="blue"
					component="h2"
				>
					{post.tags.map(
						(tag) => `#${tag.split(" ").join("")} `
					)}
				</Typography>
			</Box>
			<Typography
				gutterBottom
				variant="h5"
				component="h2"
				sx={{ padding: "0 16px" }}
			>
				{post.title}
			</Typography>
			<CardContent>
				<Typography
					variant="body2"
					color="blue"
					component="p"
				>
					{post.message}
				</Typography>
			</CardContent>
			<CardActions
				sx={{
					padding: "0 16px 8px 16px",
					display: "flex",
					justifyContent: "space-between",
				}}
			>
				<Button
					size="small"
					color="primary"
					onClick={handleLikePost}
				>
					<ThumbAltIcon fontSize="small" /> Like{" "}
					{currentPost.likes.length}
				</Button>
				<Button
					size="small"
					color="primary"
					onClick={handleDelete}
				>
					<DeleteIcon fontSize="small" />
				</Button>
			</CardActions>
		</Card>
	);
};

export default Post;
