import express from 'express';
import cors from 'cors';
import dotenv from "dotenv";
dotenv.config();
import cookieParser from 'cookie-parser';
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';
import mongoose from "mongoose";

const app = express();

app.use(express.json());
app.use(cookieParser());

// ✅ This configuration dynamically mirrors back whatever frontend URL calls it,
// allowing ANY frontend to connect while keeping cookie support active.
app.use(cors({
  origin: (origin, callback) => {
    // Allows requests with no origin (like mobile apps, curl, or Postman) 
    // AND automatically approves any frontend URL that makes a request
    callback(null, true); 
  },
  credentials: true
}));

const port = process.env.PORT || 8000;

app.get('/', (req, res) => {
  res.send("Hello from server");
});

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Database connected successfully");
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
   
 console.error("Database connection failed", error);
  process.exit(1);
}
};

startServer();

export default app;