import React, {
	FC,
	useState,
	ChangeEventHandler,
} from "react";
import {
	Container,
	AppBar,
	Grow,
	Grid,
	TextField,
	Button,
	Paper,
} from "@mui/material";
import Form from "./Form/Form";
import Posts from "./Posts/Posts";
import { useLocation } from "react-router-dom";
import { useAppDispatch } from "../hooks/hooks";
import { useNavigate } from "react-router-dom";
import Paginate from "./Pagination";
import { getPostsBySearch } from "../features/postsSlice";
import { modalOpen } from "../features/modalSlice";
import { toast } from "react-toastify";

function useQuery() {
	return new URLSearchParams(useLocation().search);
}

export const Home: FC = () => {
	const [currentId, setCurrentId] = useState("");
	const query = useQuery();
	const page = Number(query?.get("page")) || 1;
	const searchQuery = query.get("searchQuery");

	const dispatch = useAppDispatch();

	const [search, setSearch] = useState("");
	const [tags, setTags] = useState<string[]>([]);
	const navigate = useNavigate();

	const user = localStorage.getItem("user");

	const searchPost = () => {
		if (search.trim() || tags) {
			// dispatch action
			dispatch(
				getPostsBySearch({ search, tags: tags.join(",") })
			);

			navigate(
				`/posts/search?searchQuery=${
					search || "none"
				}&tags=${tags.join(",")}`,
				{ replace: true }
			);
		} else {
			navigate("/");
		}
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			searchPost();
		}
	};

	const handleAddChip = (tag: string) =>
		setTags([...tags, tag]);

	const handleDeleteChip = (chipToDelete: string) =>
		setTags(tags.filter((tag) => tag !== chipToDelete));

	const handleButton = () => {
		if (!user) {
			toast.error("You need to login first", {
				position: "top-right",
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
			});
		} else dispatch(modalOpen());
	};

	return (
		<Grow in>
			<Container maxWidth="xl">
				<Grid
					container
					justifyContent="space-between"
					alignItems="stretch"
					spacing={3}
					sx={{
						flexDirection: {
							xs: "column-reverse",
							md: "row",
						},
					}}
				>
					<Grid
						item
						xs={12}
						sm={9}
						sx={{ marginBottom: "42px" }}
					>
						<div
							style={{
								display: "flex",
								justifyContent: "center",
							}}
						>
							<Button
								color="primary"
								variant="contained"
								sx={{ marginBottom: "16px", width: "100%" }}
								onClick={handleButton}
							>
								Create a Post
							</Button>
						</div>
						<Posts setCurrentId={setCurrentId} />
					</Grid>

					<Grid item xs={12} sm={6} md={3}>
						<AppBar
							position="static"
							color="inherit"
							sx={{
								borderRadius: 4,
								marginBottom: "1rem",
								display: "flex",
								padding: "16px",
							}}
						>
							<TextField
								onKeyDown={handleKeyPress}
								name="search"
								variant="outlined"
								label="Search Memories"
								fullWidth
								value={search}
								onChange={(
									e: React.ChangeEvent<HTMLInputElement>
								) => setSearch(e.target.value)}
							/>
							{/*
<ChipInput
							style={{ margin: "10px 0" }}
							value={tags}
							onAdd={(chip) => handleAddChip(chip)}
							onDelete={(chip) => handleDeleteChip(chip)}
							label="Search Tags"
							variant="outlined"
						/>
							*/}
							<Button
								onClick={searchPost}
								variant="contained"
								color="primary"
								sx={{
									marginTop: "1rem",
								}}
							>
								Search
							</Button>
						</AppBar>

						{!searchQuery && !tags.length && (
							<Paper
								elevation={6}
								sx={{
									paddingY: "10px",
									paddingX: "5px",
									display: "flex",
									justifyContent: "center",
								}}
							>
								<Paginate page={page} />
							</Paper>
						)}
					</Grid>
				</Grid>
			</Container>
		</Grow>
	);
};
