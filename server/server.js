import express from "express";
import cors from "cors";
import 'dotenv/config';
import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoutes.js";
import resumeRouter from "./routes/resumeRoutes.js";
import aiRouter from "./routes/aiRoutes.js";
import atsRouter from "./routes/atsRoutes.js";
import chatbotRouter from "./routes/chatbotRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Database connection
await connectDB()

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send("server is live...");
});

//api routes
app.use('/api/users', userRouter);
app.use('/api/resumes', resumeRouter);
app.use('/api/ai', aiRouter);
app.use('/api/ats', atsRouter);
app.use('/api/chatbot', chatbotRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
