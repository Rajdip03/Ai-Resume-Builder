import express from "express";
import cors from "cors";
import 'dotenv/config';
import connectDB from "./configs/db.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Datbase connection
await connectDB()

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send("server is live...");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
