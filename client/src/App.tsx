import React from "react";
import {
	ThemeProvider,
	createTheme,
	Container,
	Modal,
	Grid,
	Box,
} from "@mui/material";
import { Home } from "./components/Home";
import {
	BrowserRouter,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import type { IUser } from "./types";
import SignIn from "./components/Auth/SignIn";
import SignUp from "./components/Auth/SignUp";
import PostDetails from "./components/PostDetails/PostDetails";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CreatorOrTag from "./components/CreatorOrTag/CreatorOrTag";
import CreatePostModal from "./components/Posts/Post/CreatePostModal";

const theme = createTheme();

function App() {
	const profile = localStorage.getItem("profile");

	let user: IUser | null = null;
	if (profile) {
		user = JSON.parse(profile);
	}

	return (
		<ThemeProvider theme={theme}>
			<BrowserRouter>
				<Container maxWidth="xl">
					<ToastContainer
						position="top-right"
						autoClose={5000}
						hideProgressBar={false}
						newestOnTop={false}
						closeOnClick
						rtl={false}
						pauseOnFocusLoss
						draggable
						pauseOnHover
					/>
					<Navbar />
					<Routes>
						<Route
							path="/"
							element={<Navigate to="/posts" />}
						/>
						<Route path="/posts" element={<Home />} />
						<Route
							path="/creators/:name"
							element={<CreatorOrTag />}
						/>
						<Route
							path="/tags/:name"
							element={<CreatorOrTag />}
						/>
						<Route
							path="/posts/search"
							element={<Home />}
						/>
						<Route path="/signin" element={<SignIn />} />
						<Route path="/signup" element={<SignUp />} />
						<Route
							path="/posts/:id"
							element={<PostDetails />}
						/>
						<Route path="*" element={<p>not found</p>} />
					</Routes>
					<CreatePostModal />
				</Container>
			</BrowserRouter>
		</ThemeProvider>
	);
}

export default App;
