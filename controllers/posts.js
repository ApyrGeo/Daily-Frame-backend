import mongoose from "mongoose";
import PostMessage from "../models/postMessage.js";
import User from "../models/user.js";

export const checkUserLiked = async(req, res)=>{
    const { id: _id } = req.params;

    //check id in correct format
    if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(400).json({error: "Invalid id!"});


    //check post exist
    const post = await PostMessage.findById(_id);
    if(!post)
        return res.status(404).json({error: "Post not found!"});
    try{
        const data = post.likeCount.find((id) => req.userId._id.equals(id));
        res.status(200).json({liked: data !== undefined});
    }catch(err){
        //catch any server errors
        res.status(500).json({error: err.message});
    }
}

export const getPosts = async (req, res) => {
    
    try{
        const postMessages = await PostMessage.find(); // find takes time so the function must be asyncronous, while it awaits the find method to end
        //get posts from newer to older
        return res.status(200).json(postMessages.toReversed());
    }
    catch(error){
        //catch any error
        res.status(404).json({message: error.message});
    }
}

export const getUserPosts = async(req,res)=>{
    const user = await User.findById(req.userId._id);
    try{
        const posts = await PostMessage.find({userId: user._id});

        res.status(200).json(posts.toReversed());
    }catch(err){
        res.status(500).json({error: err.message});
    }
}

export const createPost = async (req, res) => {
    const {title, message, tags, selectedFile} = req.body;

    //validate input
    if(!title || !message || !selectedFile || !tags)
        return res.status(400).json({error: "All fields are required!"});

    //check user exists
    const user = await User.findById(req.userId._id);
    if(!user)
        return res.status(404).json({error: "User not found"});

    try{
        const post = await PostMessage.create({userId: user._id, creator: user.name, title, message, tags, selectedFile}); // save takes time....await+async
        
        res.status(201).json({post});
    }
    catch(error){
        //cathc any error
        res.status(409).json({message: error.message});
    }
}

// -> /posts/1234
export const updatePost = async (req, res) => {
    const { id: _id } = req.params;
    const post = req.body;

    //check id in correct format
    if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(400).json({error: "Invalid id!"});

    //validate input
    if(!post.title || !post.message || !post.selectedFile || !post.tags)
        return res.status(400).json({error: "All fields are required!"});

    //check post exist
    const pst = await PostMessage.findById(_id);
    if(!pst)
        return res.status(404).json({error: "Post not found!"});

    //check user permission
    const user = await User.findById(req.userId._id);
    if(!pst.userId.equals(user._id))
        return res.status(401).json({error: "You do not have perimission to delete this post!"});

    try{
        const updatedPost = await PostMessage.findByIdAndUpdate(_id, post, { new: true });
    
        res.status(200).json(updatedPost);
    }catch(err){
        //catch any server errors
        res.status(500).json({error: err.message});
    }
    
}

export const deletePost = async (req, res) => {
    const { id } = req.params;

    //check id valid
    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({error: "Invalid id!"});

    //check post exists
    const post = await PostMessage.findById(id);
    if(!post)
        return res.status(404).json({error: "No post has that id"});

    //check user permission
    const user = await User.findById(req.userId._id);
    if(!post.userId.equals(user._id))
        return res.status(401).json({error: "You do not have perimission to delete this post!"});

    try{
        await PostMessage.findByIdAndDelete(id);

        res.status(200).json({ message: "Post deleted!" });
    }catch(err){
        //catch any server errors
        res.status(500).json({error: err.message});
    }
    
}

export const likePost = async (req, res) => {
    const { id } = req.params;

    //check id valid
    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({error: "No post has that id!"});

    //check post exist
    const post = await PostMessage.findById(id);
    if(!post)
        return res.status(404).json({error: "Post does not exist!"});


    //add/remove id from list
    const userId = req.userId._id;
    if(!post.likeCount.includes(userId))
    {
        post.likeCount.push(userId);
    }
    else{
        post.likeCount.remove(userId);
    }
    try{
        const updatedPost = await PostMessage.findByIdAndUpdate(id, {likeCount: post.likeCount}, {new: true});
        
        const hasLiked = post.likeCount.includes(userId);
        res.status(200).json({updatedPost, hasLiked});
    }catch(err){
        //catch any errors
        res.status(500).json({error: err.message});
    }
}