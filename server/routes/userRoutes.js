import express from "express";
import { registerUser, loginUser, logoutUser, getUserById, getUserResumes } from "../controllers/userController.js";
import protect from "../middlewares/authMiddleware.js";


const userRouter = express.Router();

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.post('/logout', logoutUser)
userRouter.get('/data', protect, getUserById)
userRouter.get('/resumes', protect, getUserResumes)
export default userRouter;
