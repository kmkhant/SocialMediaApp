import jwt, { JwtPayload } from "jsonwebtoken";
import pkg from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
const secret = "dummysecret";

const { TokenExpiredError } = pkg;

export const auth = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const token = req.headers.authorization!.split(" ")[1];
		const isCustomAuth = token.length < 500;

		let decodedData;

		if (token && isCustomAuth) {
			decodedData = jwt.verify(token, secret) as JwtPayload;
			req.userId = decodedData.id;
			// console.log(decodedData);
		} else {
			decodedData = jwt.decode(token);
			console.log(`vanilla: ${decodedData}`);
		}

		next();
	} catch (error) {
		if (error instanceof TokenExpiredError)
			res.status(404).json({ message: "Session Expired" });
		else {
			// console.log(error);
			res.status(401).json({ message: "unauthenicated" });
		}
	}
};
