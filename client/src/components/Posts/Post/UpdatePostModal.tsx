import React, {
	KeyboardEvent,
	useEffect,
	useRef,
	useState,
} from "react";
import {
	Modal,
	Box,
	TextareaAutosize,
	Typography,
	Button,
	TextField,
} from "@mui/material";
import {
	Close,
	CloudUpload,
	TagSharp,
} from "@mui/icons-material";
import { updateModalClose } from "../../../features/modalSlice";
import { getPost } from "../../../features/postsSlice";
import {
	useAppDispatch,
	useAppSelector,
} from "../../../hooks/hooks";
import { IPost, IUser } from "../../../types";
import * as api from "../../../api";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
interface IUpdateModal {
	post: IPost;
}

const UpdatePostModal: React.FC<IUpdateModal> = ({
	post,
}) => {
	const { isUpdateOpen } = useAppSelector(
		(state) => state.modalReducer
	);
	// hooks
	const dispatch = useAppDispatch();

	const { id } = useParams();

	let user: IUser | null;

	if (localStorage.getItem("user"))
		user = JSON.parse(
			localStorage.getItem("user") as string
		);
	else {
		user = null;
	}

	const [currentImage, setCurrentImage] = useState<string>(
		post.selectedFile
	);
	const [currentImageFileData, setCurrentImageFileData] =
		useState<File | null>(null);

	const handleClose = () => {
		dispatch(updateModalClose());
		setCurrentImageFileData(null);
	};

	// Refs
	const fileInput = useRef<HTMLInputElement>(null);
	const textInputRef = useRef<HTMLTextAreaElement>(null);

	// Prepare for request
	const [titleText, setTitleText] = useState<string>(
		post.title
	);
	const [currentPlainText, setCurrentPlainText] =
		useState<string>(
			post.message +
				post.tags.map((tag) => "#" + tag).join(" ")
		);

	const fileChangeHandler = async (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		// console.log("file changed");
		// console.log(e.target.files);
		if (e.target.files) {
			const file = e.target.files[0];
			setCurrentImage(URL.createObjectURL(file));
			setCurrentImageFileData(file);
			// console.log(file);
		}
	};

	const selectFile = () => {
		fileInput.current?.click();
	};

	const handleImageClose = () => {
		if (currentImage || currentImageFileData) {
			setCurrentImage("");
			setCurrentImageFileData(null);
		}
	};

	const handleTextChange = () => {
		if (textInputRef.current != null) {
			setCurrentPlainText(textInputRef.current.value);
		}
	};

	const handleTitleChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		setTitleText(e.target.value);
	};

	const handleSubmit = (e: React.MouseEvent) => {
		e.preventDefault();
		// console.log(currentPlainText);
		const regex = /\W(\#[a-zA-Z]+\b)(?!;)/gm;
		const plainTags = currentPlainText.match(regex);

		let strippedTags: string[] = [];
		let plaintext: string = currentPlainText.replace(
			regex,
			""
		);
		if (plainTags) {
			strippedTags = plainTags?.map((tag) => tag.trim());
		}

		const formData = new FormData();
		formData.append("title", titleText);
		formData.append("message", plaintext);
		formData.append(
			"tagsObject",
			JSON.stringify(strippedTags)
		);
		formData.append("creator", user!.result.name);

		if (currentImageFileData) {
			formData.append(
				"selectedFile",
				currentImageFileData as Blob
			);
		} else {
			formData.append(
				"selectedFile",
				"https://via.placeholder.com/150"
			);
			// I haven't implemented handling api when we
			// try to send without a post image, thanks
		}

		api
			.updatePost(post._id, formData)
			.then((resp) => {
				toast.success("Updated your post", {
					position: "top-right",
					autoClose: 5000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
				});
				dispatch(getPost(id as string));
				// update posts
			})
			.catch((e) => console.log(e));

		// clean up
		setCurrentImage("");
		setCurrentImageFileData(null);
		setTitleText("");
		setCurrentPlainText("");

		dispatch(updateModalClose());
	};

	if (!user) return null;

	const handleOnKeyDown = (e: KeyboardEvent) => {
		if (e.key === "Esc") {
			dispatch(updateModalClose());
			setCurrentImageFileData(null);
		}
	};

	useEffect(() => {
		if (isUpdateOpen) setCurrentImage(post.selectedFile);
	}, [isUpdateOpen]);

	return (
		<Modal
			aria-labelledby="transition-modal-title"
			aria-describedby="transition-modal-description"
			open={isUpdateOpen}
			onClose={handleClose}
			closeAfterTransition
			sx={{
				zIndex: 10,
			}}
			onKeyDown={handleOnKeyDown}
		>
			<Box
				sx={{
					backgroundColor: "white",
					marginY: "4rem",
					borderRadius: "1rem",
					width: "40%",
					height: "80%",
					marginX: "auto",
				}}
			>
				<Box
					sx={{
						display: "flex",
						justifyContent: "start",
						flexDirection: "row",
					}}
				>
					<Box
						sx={{
							display: "flex",
							justifyContent: "start",
							marginY: "20px",
							marginX: "20px",
							alignItems: "center",
						}}
					>
						<img
							src={user.result.imageUrl}
							alt="userprofile"
							style={{
								width: "50px",
								height: "50px",
								borderRadius: "3rem",
								marginRight: "15px",
							}}
						/>
						<Box
							sx={{
								display: "flex",
								flexDirection: "column",
							}}
						>
							<Typography component="h1">
								{user.result.name}
							</Typography>
							<Typography
								component="h3"
								variant="subtitle2"
								fontStyle="italic"
							>
								{user.result.email}
							</Typography>
						</Box>
					</Box>
				</Box>
				<Box
					sx={{
						paddingX: "20px",
					}}
				>
					<TextField
						id="standard-basics"
						label="Title"
						variant="standard"
						defaultValue={post.title}
						onChange={handleTitleChange}
					/>
					<TextareaAutosize
						aria-label="description-textarea"
						placeholder="What's on your mind?"
						defaultValue={
							post.message +
							post.tags.map((tag) => `#${tag} `).join("")
						}
						style={{
							width: "100%",
							height: "100px",
							marginTop: "15px",
						}}
						ref={textInputRef}
						onChange={handleTextChange}
					/>
				</Box>
				<Box
					sx={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						position: "relative",
					}}
				>
					<input
						type="file"
						name="file"
						key={currentImage}
						ref={fileInput}
						onChange={fileChangeHandler}
						style={{ display: "none" }}
					/>
					{!currentImage && (
						<Box
							sx={{
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
								cursor: "pointer",
								margin: "30px auto",
							}}
						>
							<CloudUpload
								onClick={selectFile}
								sx={{ width: "60px", height: "60px" }}
							/>
							<p style={{ padding: 0, margin: 0 }}>
								Upload an image
							</p>
						</Box>
					)}

					{currentImage && (
						<Box
							sx={{
								width: "200px",
								position: "relative",
								marginTop: "15px",
							}}
						>
							<Box
								sx={{
									display: "flex",
									justifyContent: "center",
									marginBottom: "15px",
								}}
							>
								<img
									src={currentImage}
									alt="uploadFile"
									style={{
										width: "100px",
									}}
								/>
							</Box>
							<Close
								sx={{
									position: "absolute",
									cursor: "pointer",
									right: 10,
									top: 0,
								}}
								onClick={handleImageClose}
							/>
						</Box>
					)}
				</Box>
				<Box
					sx={{
						display: "flex",
						justifyContent: "center",
					}}
				>
					<Button
						variant="contained"
						color="primary"
						onClick={handleSubmit}
					>
						Save Changes
					</Button>
				</Box>
			</Box>
		</Modal>
	);
};

export default UpdatePostModal;
