import express from "express";
import cors from "cors";
import 'dotenv/config';
import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Datbase connection
await connectDB()

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send("server is live...");
});

//api routes
app.use('/api/users', userRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
