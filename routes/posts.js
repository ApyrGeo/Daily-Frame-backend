import express from "express";
import { getPosts, createPost, getUserPosts, updatePost, deletePost, likePost, checkUserLiked } from "../controllers/posts.js"
import auth from "../middleware/auth.js";
const router = express.Router();

router.get('/', getPosts);
router.get('/:id', auth, checkUserLiked);
router.get('/user/personalposts', auth, getUserPosts);
router.post('/', auth, createPost);
router.patch('/:id', auth, updatePost);  //updating elements
router.delete('/:id', auth, deletePost);
router.patch('/:id/likePost', auth, likePost);

export {router as postRoutes};