import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";

import UserModel from "../models/user.js";

const secret = "dummysecret";

export const signin = async (
	req: Request,
	res: Response
) => {
	const { email, password } = req.body;

	try {
		const oldUser = await UserModel.findOne({ email });

		if (!oldUser)
			return res
				.status(404)
				.json({ message: "User doesn't exist" });

		const isPasswordCorrect = await bcrypt.compare(
			password,
			oldUser.password
		);

		if (!isPasswordCorrect)
			return res
				.status(400)
				.json({ message: "Invalid Credentials" });

		const token = jwt.sign(
			{ email: oldUser.email, id: oldUser._id },
			secret,
			{ expiresIn: "1h" }
		);
		res.status(200).json({ result: oldUser, token });
	} catch (error) {
		let message;
		if (error instanceof Error)
			message = "Something went wrong...";

		res.status(500).json({ message: message });
	}
};

export const signup = async (
	req: Request,
	res: Response
) => {
	const { email, password, firstName, lastName } = req.body;

	try {
		const oldUser = await UserModel.findOne({ email });

		if (oldUser)
			return res
				.status(400)
				.json({ message: "Email already exists" });

		const hashedPassword = await bcrypt.hash(password, 12);

		const result = await UserModel.create({
			email,
			password: hashedPassword,
			name: `${firstName} ${lastName}`,
			imageUrl: "https://via.placeholder.com/100",
		});

		const token = jwt.sign(
			{ email: result.email, id: result._id },
			secret,
			{ expiresIn: "1h" }
		);

		res.status(201).json({ result, token });
	} catch (error) {
		res
			.status(500)
			.json({ message: "Something went wrong..." });
		console.log(error);
	}
};
