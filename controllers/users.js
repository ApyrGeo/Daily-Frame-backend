import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config.js"
import User from "../models/user.js";

const createToken = (_id) =>{
    return jwt.sign({_id}, process.env.KEY, {expiresIn: "10d"})
}

export const createUser = async(req, res) =>{
    const {name, password, cpassword} = req.body;

    //check input
    if(!name || !password || !cpassword)
        return res.status(400).json({message: "All fields are required!"});

    if(password !== cpassword)
        return res.status(400).json({message: "Passwords do not match!"});

    //check user exists
    const exists = await User.findOne({name});
    if(exists)
        return res.status(400).json({error:"Username exists!"});

    //generate hashed password
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt)
    try{
        const user = await User.create({name, password:hashed});
        const token = createToken(user._id);
        res.status(201).json({name, token});
    }
    catch(err){
        res.status(409).json({message: err.message})
    }
}

export const deleteUser = async(req, res) =>{
    const { id } = req.params;

    //check id valid
    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({error: "Invalid id!"});

    //check user exists
    const user = await User.findById(id);
    if(!user)
        return res.status(404).json({error: "User not found!"});

    //check user permission
    const userToVerify = await User.findById(req.userId._id);
    if(!userToVerify._id.equals(user._id))
        return res.status(401).json({error: "You do not have perimission to delete this user!"});

    try{
        await User.findByIdAndDelete(id);
        res.status(200).json({ message: "User deleted successfully!" });
    }catch(err){
        //catch any server errors
        res.status(500).json({error: err.message});
    }
}

export const loginUser = async(req, res) =>{
    const {name, password} = req.body;

    //validate input
    if(!name || !password)
        return res.status(400).json({error: "All fields are required!"});

    //check user exist
    const user = await User.findOne({name});
    if(!user)
        return res.status(400).json({error: "Username not found!"});

    //check password match
    const match = await bcrypt.compare(password, user.password);
    if(!match)
        return res.status(400).json({error: "Incorrect password!"});

    try{
        const token = createToken(user._id);
        res.status(200).json({name, token});
    }catch(err){
        //catch any server error
        res.status(500).json({error: err.message});
    }
}