import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import AppError from "./services/appError.js";
import globalErrorHandler from "./middlewares/globalErrorHandler.js";
import userRouter from "./routes/user.router.js";
import appointmentRoutes from "./routes/appointment.route.js";
import medicalHistoryRoutes from "./routes/medicalHistory.route.js";
const app = express();
app.use(cors());

app.use(helmet());
app.use(morgan("common"));
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: "Too many requests from this IP, please try again after 15 minutes",
});
app.use(limiter);
app.use(express.json());
app.use("/api/v1/users", userRouter);
app.use("/api/v1/appointments", appointmentRoutes);
app.use("/api/v1/medicalHistory", medicalHistoryRoutes);

app.use((req, res, next) =>
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404))
);

app.use(globalErrorHandler);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
