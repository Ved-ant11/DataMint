import express from 'express';
import cors from 'cors';
import { configDotenv } from 'dotenv';
import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.js';
import jsonRoutes from "./routes/json.js";
import excelRoutes from "./routes/excel.js";

configDotenv();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Import routes
app.use('/api/auth', authRoutes);
app.use("/api/json", jsonRoutes);
app.use('/api/excel', excelRoutes);

// Connect to MongoDB
connectDB();

// Define the port
const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
}
);
