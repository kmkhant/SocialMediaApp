import express from "express";
import {
	getAllPosts,
	getPosts,
	getPostsBySearch,
	createPost,
	getPostsByCreator,
	getPost,
	updatePost,
	deletePost,
	likePost,
	commentPost,
} from "../controllers/posts.js";
import { auth } from "../middleware/auth.js";
import upload, { updateFile } from "../middleware/s3.js";

const router = express.Router();

router.get("/search", getPostsBySearch);
router.get("/creator", getPostsByCreator);
router.get("/all", getAllPosts);
router.get("/", getPosts);
router.get("/:id", getPost);

router.post(
	"/",
	auth,
	upload.single("selectedFile"),
	createPost
);
router.patch(
	"/:id",
	auth,
	updateFile.single("selectedFile"),
	updatePost
);
router.delete("/:id", auth, deletePost);
router.patch("/:id/likePost", auth, likePost);
router.post("/:id/commentPost", auth, commentPost);

export default router;
