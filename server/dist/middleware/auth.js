var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import jwt from "jsonwebtoken";
import pkg from "jsonwebtoken";
const secret = "dummysecret";
const { TokenExpiredError } = pkg;
export const auth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const isCustomAuth = token.length < 500;
        let decodedData;
        if (token && isCustomAuth) {
            decodedData = jwt.verify(token, secret);
            req.userId = decodedData.id;
            // console.log(decodedData);
        }
        else {
            decodedData = jwt.decode(token);
            console.log(`vanilla: ${decodedData}`);
        }
        next();
    }
    catch (error) {
        if (error instanceof TokenExpiredError)
            res.status(404).json({ message: "Session Expired" });
        else {
            // console.log(error);
            res.status(401).json({ message: "unauthenicated" });
        }
    }
});
