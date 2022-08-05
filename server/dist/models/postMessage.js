import mongoose from "mongoose";
const postSchema = new mongoose.Schema({
    _id: String,
    title: String,
    message: String,
    creator: String,
    tags: [String],
    selectedFile: String,
    likes: {
        type: [String],
        default: [],
    },
    comments: {
        type: [String],
        default: [],
    },
    createdAt: {
        type: Date,
        default: new Date(),
    },
});
const PostMessage = mongoose.model("PostMessage", postSchema);
export default PostMessage;
