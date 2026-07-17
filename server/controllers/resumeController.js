import fs from "fs";
import imageKit from "../configs/imageKit.js";
import Resume from "../models/Resume.js";


// controller for creating a new resume
// POST: /api/resumes/create
export const createResume = async (req, res) => {
    try {
        const userId = req.userId;
        const { title } = req.body;

        //create a new resume
        const newResume = await Resume.create({ userId, title });
        return res.status(201).json({ message: "Resume created successfully", resume: newResume });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

//Controller for delete resume
//DELETE: /api/resumes/delete
export const deleteResume = async (req, res) => {
    try {
        const userId = req.userId;
        const { resumeId } = req.params;

        //delete a resume
        await Resume.findOneAndDelete({ _id: resumeId, userId });

        //return success message
        return res.status(201).json({ message: "Resume deleted successfully" });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

// get user resume by id 
//GET: /api/resume/get
export const getResume = async (req, res) => {
    try {
        const userId = req.userId;
        const { resumeId } = req.params;

        // get resume by id
        const resume = await Resume.findOne({ _id: resumeId, userId });

        if (!resume) {
            return res.status(404).json({ message: "resume not found" });
        }

        resume.__v = undefined;
        resume.createdAt = undefined;
        resume.updatedAt = undefined;

        //return success message
        return res.status(200).json({ message: "Resume fetched successfully", resume });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

// controller for resume by id public
//GET: /api/resume/public
export const getPublicResumeById = async (req, res) => {
    try {
        const { resumeId } = req.params;

        // get resume by id
        const resume = await Resume.findOne({ public: true, _id: resumeId });

        if (!resume) {
            return res.status(404).json({ message: "resume not found" });
        }
        //return success message
        return res.status(200).json({ message: "Resume fetched successfully", resume });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

// controller for updating a resume
//PUT: /api/resume/update
export const updateResume = async (req, res) => {
    try {
        const userId = req.userId;
        const { resumeId, resumeData, removeBackground } = req.body;
        const image = req.file;

        let resumeDataCopy = JSON.parse(resumeData);

        if (image) {

            const imageBufferData = fs.createReadStream(image.path)
            const response = await imageKit.files.upload({
                file: imageBufferData,
                fileName: "resume.png",
                folder: "user-resumes",
                transformation: {
                    pre: "w-300,h-300, fo-face, z-0.75" + (removeBackground ? " ,e-bgremove" : " ")
                }
            });
            resumeDataCopy.personal_info.image = response.url;
        }
        const resume = await Resume.findOneAndUpdate({ userId, _id: resumeId }, resumeDataCopy, { new: true })
        return res.status(200).json({ message: "Resume updated successfully", resume });
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}