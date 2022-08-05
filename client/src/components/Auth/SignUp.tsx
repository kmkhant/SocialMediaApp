import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
	Avatar,
	Button,
	Paper,
	Typography,
	Container,
	Box,
	TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import {
	signUp,
	setNoError,
} from "../../features/authSlice";
import {
	useAppDispatch,
	useAppSelector,
} from "../../hooks/hooks";
import { LockOutlined } from "@mui/icons-material";
import type { ISignUpForm } from "../../types";
import { red } from "@mui/material/colors";

const SignUp = () => {
	const initialState: ISignUpForm = {
		email: "",
		password: "",
		confirmPassword: "",
		firstName: "",
		lastName: "",
	};

	const [form, setForm] =
		useState<ISignUpForm>(initialState);
	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	const user = localStorage.getItem("user");
	const { hasError, success } = useAppSelector(
		(state) => state.authReducer
	);
	const [showPassword, setShowPassword] =
		useState<boolean>(false);

	const [emailError, setEmailError] =
		useState<boolean>(false);

	const handleShowPassword = () =>
		setShowPassword((prev) => !prev);

	const handleSubmit = (
		e: React.FormEvent<HTMLFormElement>
	) => {
		e.preventDefault();
		try {
			dispatch(signUp(form));
		} catch (error) {
			console.log("ERROR CATCHED During SignUp Dispatch");
			console.log(error);
		}
	};

	useEffect(() => {
		if (user) navigate("/");
	}, [user, success]);

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

	const handleMouseDownPassword = (
		event: React.MouseEvent<HTMLButtonElement>
	) => {
		event.preventDefault();
	};

	const handleClickShowPassword = () => {
		setShowPassword((prev) => !prev);
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
					Sign Up
				</Typography>
				<Box sx={{ marginTop: "6px", width: "100%" }}>
					<form onSubmit={handleSubmit}>
						<Box
							sx={{
								display: "flex",
								marginTop: "16px",
								paddingBottom: "20px",
								alignItems: "center",
								justifyContent: "center",
								flexDirection: "column",
							}}
						>
							<TextField
								name="firstName"
								label="First Name"
								onChange={handleChange}
								autoFocus
							/>
							<TextField
								name="lastName"
								label="Last Name"
								onChange={handleChange}
								autoFocus
								sx={{ marginTop: "16px" }}
							/>
							<TextField
								name="email"
								label="Email Address"
								onChange={handleChange}
								autoFocus
								type="email"
								error={emailError}
								sx={{ marginTop: "16px" }}
							/>
							<TextField
								name="password"
								label="Password"
								onChange={handleChange}
								autoFocus
								type={showPassword ? "text" : "password"}
								sx={{ marginTop: "16px" }}
							/>

							<TextField
								name="confirmPassword"
								label="Confirm Password"
								onChange={handleChange}
								autoFocus
								type={showPassword ? "text" : "password"}
								sx={{ marginTop: "16px" }}
							/>

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
										User already exists
									</Typography>
								</Box>
							)}
							<Button
								type="submit"
								variant="contained"
								color="primary"
								sx={{ width: "40%", marginTop: "16px" }}
							>
								Sign Up
							</Button>

							<Box sx={{ marginTop: "16px" }}>
								<Typography component="p">
									Already has an account ?{" "}
									<a href="/signin">Sign In</a>
								</Typography>
							</Box>
						</Box>
					</form>
				</Box>
			</Paper>
		</Container>
	);
};

export default SignUp;
