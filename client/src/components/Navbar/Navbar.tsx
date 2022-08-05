import React, { useState, useEffect } from "react";
import {
	AppBar,
	Typography,
	Toolbar,
	Avatar,
	Button,
	Box,
} from "@mui/material";
import {
	Link,
	useNavigate,
	useLocation,
} from "react-router-dom";
import { useAppDispatch } from "../../hooks/hooks";
import decode, { JwtPayload } from "jwt-decode";

import memoriesLogo from "../../images/memories.png";
import memoriesText from "../../images/memoriesText.png";
import { deepPurple } from "@mui/material/colors";
import { IUser } from "../../types";
import { signOut } from "../../features/authSlice";

const Navbar: React.FC = () => {
	const [user, setUser] = useState<IUser | null>(null);

	const location = useLocation();
	const navigate = useNavigate();
	const dispatch = useAppDispatch();

	// dispatch(signOut());

	const logout = () => {
		// dispatch logout
		dispatch(signOut());
		navigate("/signin", { replace: true });
	};

	// console.log(location);

	useEffect(() => {
		const userData = localStorage.getItem("user");
		// console.log(userData);
		if (userData) {
			// console.log(userData);
			setUser(JSON.parse(userData));
			const token = user?.token;
			if (token) {
				const decodedToken = decode<JwtPayload>(token);

				if (
					(decodedToken.exp as number) * 1000 <
					new Date().getTime()
				)
					logout();
			}
		}
		// console.log("Component Build");
	}, [location]);

	if (
		location.pathname === "/signin" ||
		location.pathname === "/signup"
	)
		return null;

	// console.log("DEBGU");

	return (
		<AppBar
			position="static"
			color="inherit"
			sx={{
				borderRadius: 15,
				margin: "30px 0",
				display: "flex",
				flexDirection: { sm: "column", md: "row" },
				justifyContent: "space-between",
				alignItems: "center",
				padding: "10px 50px",
			}}
		>
			<Box sx={{ display: "flex", alignItems: "center" }}>
				<Link to="/">
					<Box
						sx={{ marginLeft: "10px", marginTop: "5px" }}
					>
						<img
							src={memoriesText}
							alt="icon"
							height="45px"
						/>
					</Box>
				</Link>
				<Box sx={{ marginLeft: "10px", marginTop: "5px" }}>
					<img
						src={memoriesLogo}
						alt="icon"
						height="40px"
					/>
				</Box>
			</Box>

			<Toolbar
				sx={{
					display: "flex",
					justifyContent: "flex-end",
					width: { sm: "auto", md: "400px" },
				}}
			>
				{user?.result ? (
					<Box
						sx={{
							display: "flex",
							justifyContent: {
								sm: "center",
								md: "space-between",
							},
							width: { sm: "auto", md: "400px" },
							alignItems: "center",
							marginTop: { sm: "20" },
						}}
					>
						<Avatar
							sx={{
								color: deepPurple[500],
								backgroundColor: deepPurple[500],
							}}
							alt={user?.result.name}
							src={user?.result.imageUrl}
						>
							{user.result.name}
						</Avatar>
						<Typography
							variant="h6"
							sx={{
								display: "flex",
								alignItems: "center",
								textAlign: "center",
							}}
						>
							{user?.result.name}
						</Typography>
						<Button
							sx={{ marginLeft: "20px" }}
							variant="contained"
							color="secondary"
							onClick={logout}
						>
							Logout
						</Button>
					</Box>
				) : (
					<Link to="/signin">
						<Button variant="contained" color="primary">
							Sign In
						</Button>
					</Link>
				)}
			</Toolbar>
		</AppBar>
	);
};

export default Navbar;
