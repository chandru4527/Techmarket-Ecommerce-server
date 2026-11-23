import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// Routes
import indexRoutes from "./routes/index.routes.js";

// Middleware
import { errorHandler, notFound } from "./middleware/error.middleware.js";

const app = express();

app.disable("x-powered-by");

app.use(cors({
    origin: [
        "http://localhost:4527", process.env.CLIENT_URL,],
    credentials: true,
})
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(cookieParser());

// API routes
app.use("/v1", indexRoutes);

// Error handling (must be last)
app.use(notFound);
app.use(errorHandler);


export default app;