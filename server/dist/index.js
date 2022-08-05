import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import * as dotenv from "dotenv";
import postRoutes from "./routes/posts.js";
import userRouter from "./routes/user.js";
const app = express();
// setting up middlewares
app.use(bodyParser.json({ limit: "30mb" }));
dotenv.config({ path: "./.env.local" });
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/posts", postRoutes);
app.use("/user", userRouter);
const CONNECTION_URL = `mongodb+srv://khaingmyel_dev:${process.env.MONGODB_PASSWORD}@mernsocialmedia.7rpng.mongodb.net/?retryWrites=true&w=majority`;
const CONNECTION_PORT = process.env.PORT || 5000;
mongoose
    .connect(CONNECTION_URL)
    .then(() => app.listen(CONNECTION_PORT, () => console.log(`Server running at port: ${CONNECTION_PORT}`)))
    .catch((error) => console.log(error.message));
