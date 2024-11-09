import express from "express";
import { createUser, deleteUser, loginUser } from "../controllers/users.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post('/', createUser);
router.post('/login', loginUser);
router.delete('/:id', auth, deleteUser);

export {router as userRoutes}