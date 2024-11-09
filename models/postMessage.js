import mongoose, { mongo } from "mongoose";

const postSchema = mongoose.Schema({
    userId:{ type: mongoose.Types.ObjectId, required: true, ref: "User"},
    creator: String,
    title: String,
    message: String,
    tags: [String],
    selectedFile: String,
    likeCount: [{type: mongoose.Types.ObjectId}],
    createdAt: {
        type: Date,
        default: new Date()
    },
});

const PostMessage = mongoose.model("PostMesage", postSchema);

export default PostMessage;