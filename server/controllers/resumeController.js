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

// update user resume
// PUT: /api/resume/update
export const updateResume = async (req, res) => {
    try {
        const userId = req.userId;
        const { resumeId } = req.params;
        const { title } = req.body;

        // update a resume
        const updatedResume = await Resume.findOneAndUpdate({ _id: resumeId, userId }, { title }, { new: true });

        //return success message
        return res.status(201).json({ message: "Resume updated successfully", resume: updatedResume });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}
}