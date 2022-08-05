import mongoose from "mongoose";

interface IMessage {
	_id: string;
	title: string;
	message: string;
	creator: string;
	tags: [string];
	selectedFile: string;
	likes: string[];
	comments: string[];
	createdAt: Date;
}

const postSchema = new mongoose.Schema<IMessage>({
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

const PostMessage = mongoose.model(
	"PostMessage",
	postSchema
);

export default PostMessage;
