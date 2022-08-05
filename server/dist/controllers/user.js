var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import UserModel from "../models/user.js";
const secret = "dummysecret";
export const signin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const oldUser = yield UserModel.findOne({ email });
        if (!oldUser)
            return res
                .status(404)
                .json({ message: "User doesn't exist" });
        const isPasswordCorrect = yield bcrypt.compare(password, oldUser.password);
        if (!isPasswordCorrect)
            return res
                .status(400)
                .json({ message: "Invalid Credentials" });
        const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, { expiresIn: "1h" });
        res.status(200).json({ result: oldUser, token });
    }
    catch (error) {
        let message;
        if (error instanceof Error)
            message = "Something went wrong...";
        res.status(500).json({ message: message });
    }
});
export const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, firstName, lastName } = req.body;
    try {
        const oldUser = yield UserModel.findOne({ email });
        if (oldUser)
            return res
                .status(400)
                .json({ message: "Email already exists" });
        const hashedPassword = yield bcrypt.hash(password, 12);
        const result = yield UserModel.create({
            email,
            password: hashedPassword,
            name: `${firstName} ${lastName}`,
            imageUrl: "https://via.placeholder.com/100",
        });
        const token = jwt.sign({ email: result.email, id: result._id }, secret, { expiresIn: "1h" });
        res.status(201).json({ result, token });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "Something went wrong..." });
        console.log(error);
    }
});
