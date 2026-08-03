import mongoose from "mongoose";

const ResumeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, ref: "User",
    },
    title: {
        type: String,
        default: "Untitled Resume",
    },
    public: {
        type: Boolean,
        default: false,
    },
    templates: {
        type: String,
        default: "classic",
    },
    accent_color: {
        type: String,
        default: "#3B82F6",
    },
    professional_summary: {
        type: String,
        default: "",
    },
    skills: [
        {
            type: String,
        }
    ],
    experiences: [
        {
            company: { type: String },
            position: { type: String },
            start_date: { type: String },
            end_date: { type: String },
            is_present: { type: Boolean },
            description: { type: String },
            location: { type: String },
        }
    ],
    project: [
        {
            name: { type: String },
            tech_stack: [{ type: String }],
            description: { type: String },
            link: { type: String }
        }
    ],
    educations: [
        {
            degree: { type: String },
            institution: { type: String },
            field: { type: String },
            graduation_date: { type: String },
            location: { type: String },
            gpa: { type: String },
        }
    ],
    personal_info: {
        image: {
            type: String,
            default: ""
        },
        full_name: {
            type: String,
            default: ""
        },
        profession: {
            type: String,
            default: ""
        },
        email: {
            type: String,
            default: ""
        },
        phone: {
            type: String,
            default: ""
        },
        location: {
            type: String,
            default: ""
        },
        linkedin: {
            type: String,
            default: ""
        },
        website: {
            type: String,
            default: ""
        },
    },
}, { timestamps: true, minimize: false })
const Resume = mongoose.model("Resume", ResumeSchema)
export default Resume;
