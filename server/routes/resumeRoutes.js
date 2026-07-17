import express from "express";
import protect from "../middlewares/authMiddleware";
import {
    createResume,
    deleteResume,
    getPublicResumeById,
    getResume,
    updateResume
} from "../controllers/resumeController";
import upload from "../configs/multer";


const resumeRouter = express.Router();

resumeRouter.post('/create', protect, createResume)
resumeRouter.delete('/delete/:resumeId', protect, deleteResume)
resumeRouter.get('/get/:resumeId', protect, getResume)
resumeRouter.get('/public/:resumeId', protect, getPublicResumeById)
resumeRouter.put('/update', upload.single("image"), protect, updateResume)


export default resumeRouter;