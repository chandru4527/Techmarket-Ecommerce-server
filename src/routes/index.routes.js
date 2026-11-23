import { Router } from "express";

// Routes
import authRoutes from "./auth.routes.js";
// import adminRoutes from "./admin/admin.index.routes.js";
// import userRoute from './user/user.routes.js';
// import mediaRoutes from "./media.routes.js";

const router = Router();

// check if the server is running
router.route("/").get((req, res) => {
    return res.status(200).json({
        success: true,
        message: "Welcome to the API, Server is running 🚀",
    });
});

// Auth routes
router.use("/auth", authRoutes);

// Admin routes
// router.use("/admin", adminRoutes);

// User routes
// router.use("/user", userRoute)

// Media routes
// router.use("/media", mediaRoutes);

export default router;