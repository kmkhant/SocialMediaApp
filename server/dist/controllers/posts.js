var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Router } from "express";
import mongoose from "mongoose";
import PostMessage from "../models/postMessage.js";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../middleware/s3.js";
const router = Router();
export const getAllPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield PostMessage.aggregate([
            { $sample: { size: 4 } },
        ]);
        // console.log("Pass");
        res.status(200).json({
            data: posts,
        });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "Something Went Wrong" });
    }
});
export const getPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { page } = req.query;
    // console.log(req.query);
    try {
        const LIMIT = 2;
        const startIndex = (Number(page) - 1) * LIMIT;
        const total = yield PostMessage.countDocuments({});
        const posts = yield PostMessage.find()
            .sort({ _id: -1 })
            .limit(LIMIT)
            .skip(startIndex);
        res.status(200).json({
            data: posts,
            currentPage: Number(page),
            numberOfPages: Math.ceil(total / LIMIT),
        });
    }
    catch (error) {
        let message = "Cannot Get Post Messages";
        if (error instanceof Error)
            message = error.message;
        res.status(404).json({ message: message });
    }
});
export const getPostsBySearch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchQuery, tags } = req.query;
    try {
        const title = new RegExp(searchQuery, "i");
        const posts = yield PostMessage.find({
            $or: [{ title }, { tags: { $in: tags.split(",") } }],
        });
        res.json({ data: posts });
    }
    catch (error) {
        let message;
        if (error instanceof Error)
            message = error.message;
        res.status(404).json({ message: message });
    }
});
export const getPostsByCreator = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.query;
    try {
        const posts = yield PostMessage.find({ creator: name });
        res.json({ data: posts });
    }
    catch (error) {
        let message;
        if (error instanceof Error)
            message = error.message;
        res.status(404).json({ message: message });
    }
});
export const getPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const post = yield PostMessage.findById(id);
        res.status(200).json(post);
    }
    catch (error) {
        let message;
        if (error instanceof Error)
            message = error.message;
        res.status(404).json({ message: message });
    }
});
export const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, message, creator, tagsObject } = req.body;
    const rawTags = JSON.parse(tagsObject) || [];
    let tags = [];
    if (rawTags.length) {
        tags = rawTags.map((tag) => {
            return tag.substring(1);
        });
    }
    const file = req.file;
    const _id = file.key;
    const selectedFile = file.location;
    // res.status(200).json({ message: "OK" });
    const newPostMessage = new PostMessage({
        _id,
        title,
        message,
        selectedFile,
        creator,
        tags,
    });
    try {
        yield newPostMessage.save();
        res.status(201).json(newPostMessage);
    }
    catch (error) {
        let message = "Cannot create a new post";
        if (error instanceof Error)
            message = error.message;
        res.status(409).json({ message: message });
    }
});
export const updatePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { title, message, creator, tagsObject } = req.body;
    const rawTags = JSON.parse(tagsObject) || [];
    let tags = [];
    if (rawTags.length) {
        tags = rawTags.map((tag) => {
            return tag.substring(1);
        });
    }
    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(404).send(`No Post with Id`);
    if (req.file) {
        const file = req.file;
        const selectedFile = file.location;
        const updatedPost = {
            creator,
            title,
            message,
            tags,
            selectedFile,
            id,
        };
        yield PostMessage.findByIdAndUpdate(id, updatedPost, {
            new: true,
        });
        res.status(200).json(updatedPost);
    }
    else {
        const updatedPost = {
            creator,
            title,
            message,
            tags,
            id,
        };
        yield PostMessage.findByIdAndUpdate(id, updatedPost);
        res.status(200).json(updatedPost);
    }
});
export const deletePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(404).send(`No post with id: ${id}`);
    const command = new DeleteObjectCommand({
        Bucket: process.env.S3_bucket,
        Key: id,
    });
    // delete s3 object
    try {
        const resp = yield s3.send(command);
        // console.log(resp);
        // delete mongoose object
        yield PostMessage.findByIdAndRemove(id);
        res
            .status(200)
            .json({ message: "Post deleted successfully." });
    }
    catch (error) {
        console.log(error);
        res
            .status(500)
            .json({ message: "Error Deleting post" });
    }
});
export const likePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!req.userId) {
        return res.json({ message: "Unauthenicated" });
    }
    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(404).send(`No post with id: ${id}`);
    const post = yield PostMessage.findById(id);
    if (post) {
        const index = post.likes.findIndex((id) => id === String(req.userId));
        const initialLikesLength = post.likes.length;
        if (index === -1) {
            post.likes.push(req.userId);
        }
        else {
            post.likes = post.likes.filter((id) => id !== String(req.userId));
        }
        const finalLikesLength = post.likes.length;
        const isLiked = initialLikesLength < finalLikesLength;
        const updatedPost = yield PostMessage.findByIdAndUpdate(id, post, { new: true });
        res.status(200).json({ updatedPost, isLiked: isLiked });
    }
    else {
        res.status(404).json({ message: "Invalid Post" });
    }
});
export const commentPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { value } = req.body;
    console.log(id);
    const post = yield PostMessage.findById(id);
    if (post) {
        post.comments.push(value);
        const updatedPost = yield PostMessage.findByIdAndUpdate(id, post, { new: true });
        res.json(updatedPost);
    }
    else {
        res.status(404).json("Invalid Post");
    }
});
export default router;
