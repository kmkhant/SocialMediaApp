import React, { useEffect, useRef, useState } from "react";
import {
	Paper,
	CircularProgress,
	Typography,
	Divider,
	Button,
	Box,
	TextareaAutosize,
} from "@mui/material";
import {
	useAppDispatch,
	useAppSelector,
} from "../../hooks/hooks";
import moment from "moment";
import {
	useParams,
	useNavigate,
	Link,
} from "react-router-dom";
import {
	commentPostById,
	getAllPosts,
	getPost,
} from "../../features/postsSlice";
import { Edit } from "@mui/icons-material";
import { IUser } from "../../types";
import UpdatePostModal from "../Posts/Post/UpdatePostModal";
import { updateModalOpen } from "../../features/modalSlice";
import { toast } from "react-toastify";
// import comment section here

const PostDetails = () => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const textAreaRef = useRef<HTMLTextAreaElement>(null);
	const [comment, setComment] = useState<string>("");
	const { id } = useParams();

	useEffect(() => {
		if (id) dispatch(getPost(id));
		dispatch(getAllPosts());
	}, [id]);

	const handleEdit = () => {
		// edit
		dispatch(updateModalOpen());
	};

	const handleCommentInput = (
		e: React.ChangeEvent<HTMLTextAreaElement>
	) => {
		setComment(e.target.value);
	};

	// implement getPost by search

	const { post, isLoading, posts } = useAppSelector(
		(state) => state.postsReducer
	);

	const handleCommentSubmit = () => {
		// send comment
		// console.log(comment);
		if (post) {
			dispatch(
				commentPostById({
					id: post._id as string,
					value: comment,
				})
			)
				.unwrap()
				.then((resp) => {
					toast.success("Posted a comment", {
						position: "top-right",
						autoClose: 5000,
						hideProgressBar: false,
						closeOnClick: true,
						pauseOnHover: true,
						draggable: true,
						progress: undefined,
					});

					console.log(resp);
				})
				.catch((err) => {
					toast.success("Post comment failed", {
						position: "top-right",
						autoClose: 5000,
						hideProgressBar: false,
						closeOnClick: true,
						pauseOnHover: true,
						draggable: true,
						progress: undefined,
					});
				});
		}

		// clear
		if (textAreaRef.current) {
			textAreaRef.current.value = "";
		}
		setComment("");
	};

	const openPost = (_id: string) =>
		navigate(`/posts/${_id}`);

	if (isLoading) {
		return (
			<Paper
				elevation={6}
				sx={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					padding: "20px",
					borderRadius: "15px",
					height: "39vh",
				}}
			>
				<CircularProgress size="7rem" />
			</Paper>
		);
	}

	if (!post) return <p>No Post for {id}</p>;

	const recommendedPosts = posts.filter(
		({ _id }) => _id !== post._id
	);

	let user: IUser | null = null;

	if (localStorage.getItem("user")) {
		user =
			JSON.parse(localStorage.getItem("user") || "") ||
			undefined;
	}

	return (
		<>
			<Paper
				style={{ padding: "20px", borderRadius: "15px" }}
				elevation={6}
			>
				<Box
					sx={{
						display: "flex",
						justifyContent: "space-between",
						width: "100%",
						flexDirection: { sm: "column", md: "row" },
					}}
				>
					<Box
						sx={{
							borderRadius: "20px",
							margin: "10px",
						}}
					>
						<Box sx={{ display: "flex" }}>
							<Typography variant="h3" component="h2">
								{post.title}
							</Typography>
							{user && user.result.name === post.creator && (
								<Edit
									sx={{
										color: "black",
										marginLeft: "15px",
										cursor: "pointer",
									}}
									onClick={handleEdit}
								/>
							)}
						</Box>

						<Typography
							gutterBottom
							variant="h6"
							color="textSecondary"
							component="h2"
						>
							{post.tags.map((tag: string) => (
								<Link
									key={tag}
									to={`/tags/${tag}`}
									style={{
										textDecoration: "none",
										color: "#3f51b5",
									}}
								>
									{`#${tag} `}
								</Link>
							))}
						</Typography>
						<Typography
							gutterBottom
							variant="body1"
							component="p"
						>
							{post.message}
						</Typography>
						<Typography variant="h6">
							Created by:
							<Link
								to={`/creators/${post.creator}`}
								style={{
									textDecoration: "none",
									color: "#3f51b5",
								}}
							>
								{` ${post.creator}`}
							</Link>
						</Typography>
						<Typography variant="body1">
							{moment(post.createdAt).fromNow()}
						</Typography>
						<Divider style={{ margin: "20px 0" }} />
						<Typography variant="body1">
							<strong>Realtime Chat - Coming Soon!</strong>
						</Typography>

						<Divider style={{ margin: "20px 0" }} />
						{/* comment section here */}
						{post.comments.length > 0 && (
							<Box>
								{post.comments.map((comment) => (
									<p key={comment}>{comment}</p>
								))}
							</Box>
						)}
						{user && (
							<Box>
								<Typography variant="body1">
									<strong>Write a comment</strong>
								</Typography>
								<Box
									sx={{
										display: "flex",
										padding: "10px",
										alignItems: "center",
									}}
								>
									<img
										src={user?.result.imageUrl}
										style={{
											borderRadius: "2rem",
											width: "40px",
										}}
									/>
									<TextareaAutosize
										aria-label="comment text"
										minRows={5}
										placeholder="What's your thoughts ? "
										style={{
											marginLeft: "20px",
											width: 350,
										}}
										ref={textAreaRef}
										onChange={handleCommentInput}
									/>
									<Button
										variant="contained"
										sx={{ marginLeft: "20px" }}
										onClick={handleCommentSubmit}
									>
										Post comment
									</Button>
								</Box>
							</Box>
						)}

						<Divider style={{ margin: "20px 0" }} />
					</Box>
					<Box sx={{ marginLeft: { sm: 0, md: "20px" } }}>
						<Box
							src={post.selectedFile}
							alt={post.title}
							sx={{
								width: "500px",
							}}
							component="img"
						/>
					</Box>
				</Box>
				{!!recommendedPosts.length && (
					<Box
						sx={{
							borderRadius: "20px",
							margin: "10px",
							flex: 1,
						}}
						component="div"
					>
						<Typography gutterBottom variant="h5">
							You might also like:{" "}
						</Typography>
						<Divider />
						<Box
							sx={{
								display: "flex",
								flexDirection: { sm: "column", md: "row" },
							}}
						>
							{recommendedPosts.map(
								({
									title,
									creator,
									message,
									likes,
									selectedFile,
									_id,
								}) => (
									<Box
										sx={{
											margin: "20px",
											cursor: "pointer",
										}}
										onClick={() => openPost(_id.toString())}
										key={_id.toString()}
										component="div"
									>
										<Typography gutterBottom variant="h6">
											{title}
										</Typography>

										<Typography
											gutterBottom
											variant="subtitle2"
										>
											{creator}
										</Typography>

										<Typography
											gutterBottom
											variant="subtitle2"
										>
											{message}
										</Typography>

										<Typography
											gutterBottom
											variant="subtitle1"
										>
											Likes: {likes.length}
										</Typography>
										<img src={selectedFile} width="200px" />
									</Box>
								)
							)}
						</Box>
					</Box>
				)}
			</Paper>
			<UpdatePostModal post={post} />
		</>
	);
};

export default PostDetails;
