import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
	Avatar,
	Button,
	Paper,
	Grid,
	Typography,
	Container,
	Box,
	TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
	Visibility,
	VisibilityOff,
} from "@mui/icons-material";

import {
	signIn,
	setNoError,
	signOut,
} from "../../features/authSlice";
import {
	useAppDispatch,
	useAppSelector,
} from "../../hooks/hooks";
import { LockOutlined } from "@mui/icons-material";
import type { ISignInForm } from "../../types";
import { red } from "@mui/material/colors";
import { toast } from "react-toastify";

const initialState = {
	email: "",
	password: "",
};

const SignIn = () => {
	const [form, setForm] =
		useState<ISignInForm>(initialState);
	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	const user = localStorage.getItem("user");
	const { hasError } = useAppSelector(
		(state) => state.authReducer
	);
	const [showPassword, setShowPassword] =
		useState<boolean>(false);

	const [emailError, setEmailError] =
		useState<boolean>(false);

	const handleShowPassword = () =>
		setShowPassword((prev) => !prev);

	const handleSubmit = async (
		e: React.FormEvent<HTMLFormElement>
	) => {
		e.preventDefault();
		dispatch(signIn(form))
			.unwrap()
			.then((resp) => {
				toast.success("Login Success", {
					position: "top-right",
					autoClose: 5000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
				});
			})
			.catch((e) => {
				toast.error("Login Failure", {
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

	useEffect(() => {
		if (user) navigate("/");
	}, [user]);

	useEffect(() => {
		dispatch(setNoError());
	}, []);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		if (e.target.name === "email" && e.target.value) {
			if (
				/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(
					e.target.value
				)
			)
				setEmailError(false);
			else {
				setEmailError(true);
			}
		} else {
			setEmailError(false);
		}
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	// console.log(form);
	return (
		<Container component="main" maxWidth="xs">
			<Helmet>
				<title>SMA - Sign In</title>
			</Helmet>
			<Paper
				elevation={6}
				sx={{
					marginTop: "32px",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					padding: "8px",
				}}
			>
				<Avatar
					sx={{ margin: "4px", backgroundColor: "blue" }}
				>
					<LockOutlined />
				</Avatar>
				<Typography component="h1" variant="h5">
					Sign In
				</Typography>
				<Box sx={{ marginTop: "6px", width: "100%" }}>
					<form onSubmit={handleSubmit}>
						<Grid
							container
							spacing={0}
							sx={{
								marginTop: "16px",
								paddingBottom: "20px",
								alignItems: "center",
								justifyContent: "center",
								flexDirection: "column",
							}}
						>
							<TextField
								name="email"
								label="Email Address"
								onChange={handleChange}
								autoFocus
								type="email"
								error={emailError}
							/>
							<Box
								sx={{
									display: "flex",
									marginTop: "16px",
									alignItems: "center",
								}}
							>
								<TextField
									name="password"
									label="Password"
									onChange={handleChange}
									autoFocus
									type={showPassword ? "text" : "password"}
								/>
							</Box>
							{hasError && (
								<Box
									sx={{
										marginTop: "16px",
										padding: "8px",
										backgroundColor: red[100],
										borderRadius: "4px",
									}}
								>
									<Typography
										component="p"
										sx={{
											fontSize: "1rem",
										}}
									>
										Invalid Username or Password
									</Typography>
								</Box>
							)}
							<Button
								type="submit"
								variant="contained"
								color="primary"
								sx={{ width: "40%", marginTop: "16px" }}
							>
								Sign In
							</Button>

							<Box sx={{ marginTop: "16px" }}>
								<Typography component="p">
									Create an account ?{" "}
									<a href="/signup">Sign Up</a>
								</Typography>
							</Box>
						</Grid>
					</form>
				</Box>
			</Paper>
		</Container>
	);
};

export default SignIn;
