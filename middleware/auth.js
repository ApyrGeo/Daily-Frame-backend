import jwt from "jsonwebtoken"
import User from "../models/user.js";

const auth = async(req, res, next) =>{
    //check header contains token
    const {authorization} = req.headers;
    if(!authorization)
        return res.status(401).json({error: "Auth token not found!"});

    const token = authorization.split(" ")[1];

    //check token valid
    try{
        const {_id} = jwt.verify(token, process.env.KEY);
        
        req.userId = await User.findById(_id).select("_id");

        next();
    }
    catch(err){
        res.status(401).json({error: err.message});
    }
}

export default auth