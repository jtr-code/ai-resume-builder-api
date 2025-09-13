import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import compression from "compression";
import { apiLimiter } from "./utils/rateLimiter";
import { errorHandler } from "./middlewares/error.middleware";

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());
app.use(compression());
app.use(apiLimiter);

// routes import
import healthRoutes from "./routes/health.route";
import userRoutes from "./routes/user.route";
import contactRoutes from "./routes/contact.route";
import experienceRoutes from "./routes/experience.route";
import educationRoutes from "./routes/education.route";

// api routes
app.use("/api/v1/health", healthRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/contact", contactRoutes);
app.use("/api/v1/experience", experienceRoutes);
app.use("/api/v1/education", educationRoutes);

app.use(errorHandler);

export { app };
